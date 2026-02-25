import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import cv2
import numpy as np
import mediapipe as mp
import base64
import shutil
import threading
from typing import List
from datetime import datetime
from pymongo import MongoClient
import glob
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()
# ==== CONFIG ====
UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
STUDENT_IMAGES_DIR = "backend/Student_Images"

app = FastAPI()

# Mount public directory for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

from .database import students_collection, attendance_collection, admin_collection, MONGO_URI
SIMILARITY_THRESHOLD = 0.45 

# ==== MEDIAPIPE LAZY SETUP ====
mp_face_detection = None
face_detection_model = None

def get_face_detector():
    global mp_face_detection, face_detection_model
    if face_detection_model is None:
        print("[INFO] Initializing MediaPipe Face Detection...")
        mp_face_detection = mp.solutions.face_detection
        # Using model=0 for short range (ideal for selfie/webcam)
        face_detection_model = mp_face_detection.FaceDetection(
            model_selection=0,
            min_detection_confidence=0.4
        )
    return face_detection_model

# ==== GLOBAL STATE ====
known_faces = [] # List of {"name": name, "hist": histogram}

print(f"[INFO] Connected to MongoDB at {MONGO_URI}")

# ==== CORS ====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==== HELPER FUNCTIONS ====

def get_face_embedding(image, silent=False):
    """
    Detects face and returns a Histogram 'embedding' for comparison.
    """
    if image is None:
        if not silent: print("[ERROR] No image provided to get_face_embedding")
        return None
        
    height, width, _ = image.shape
    # if not silent: print(f"[DEBUG] Processing image: {width}x{height}")

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    detector = get_face_detector()
    results = detector.process(rgb_image)

    if not results or not results.detections:
        if not silent: print(f"[WARNING] No face detected by MediaPipe in {width}x{height} image")
        return None

    if not silent: print(f"[INFO] Detected {len(results.detections)} face(s)")

    detection = results.detections[0]
    bboxC = detection.location_data.relative_bounding_box
    x, y, w, h = int(bboxC.xmin * width), int(bboxC.ymin * height), int(bboxC.width * width), int(bboxC.height * height)
    
    x_start = max(0, x)
    y_start = max(0, y)
    x_end = min(width, x + w)
    y_end = min(height, y + h)

    face_crop = image[y_start:y_end, x_start:x_end]
    if face_crop.size == 0: return None

    face_crop = cv2.resize(face_crop, (128, 128))
    hsv_crop = cv2.cvtColor(face_crop, cv2.COLOR_BGR2HSV)
    # Using 32x32 H-S histogram for better performance/accuracy balance
    hist = cv2.calcHist([hsv_crop], [0, 1], None, [32, 32], [0, 180, 0, 256])
    cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX)
    
    return hist

def load_known_faces():
    global known_faces
    known_faces = []
    
    # 1. Load from Disk
    if os.path.exists(STUDENT_IMAGES_DIR):
        all_files = glob.glob(os.path.join(STUDENT_IMAGES_DIR, "**", "*.*"), recursive=True)
        valid_extensions = {".jpg", ".jpeg", ".png"}
        img_files = [f for f in all_files if os.path.splitext(f)[1].lower() in valid_extensions]
        
        for file_path in img_files:
            img = cv2.imread(file_path)
            if img is not None:
                hist = get_face_embedding(img, silent=True)
                if hist is not None:
                    name = os.path.basename(os.path.dirname(file_path)) or os.path.splitext(os.path.basename(file_path))[0]
                    # Try to associate with database ID for attendance records
                    student_doc = students_collection.find_one({"name": name})
                    student_id = str(student_doc["_id"]) if student_doc else None
                    known_faces.append({"id": student_id, "name": name, "hist": hist})

    # 2. Load from Database
    db_students = list(students_collection.find({"$or": [{"faceEmbedding": {"$exists": True}}, {"faceEmbeddings": {"$exists": True}}]}))
    for s in db_students:
        try:
            # New Multi-Sample Schema
            if "faceEmbeddings" in s and isinstance(s["faceEmbeddings"], list):
                for emb in s["faceEmbeddings"]:
                    hist = np.array(emb, dtype=np.float32).reshape(32, 32)
                    known_faces.append({"id": str(s["_id"]), "name": s["name"], "hist": hist, "embeddings": [emb]})
            
            # Legacy Single-Sample Schema
            elif "faceEmbedding" in s:
                hist = np.array(s["faceEmbedding"], dtype=np.float32).reshape(32, 32)
                known_faces.append({"id": str(s["_id"]), "name": s["name"], "hist": hist, "embeddings": [s["faceEmbedding"]]})
        except Exception as e:
            print(f"[ERROR] Loading face for {s.get('name')}: {e}")
            continue
            
    print(f"[INFO] Total loaded reference faces: {len(known_faces)}")

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.on_event("startup")
async def startup_event():
    print("[INFO] Cleaning up legacy database indexes...")
    try:
        # Log indexes for debugging
        idxs = students_collection.index_information()
        print(f"[INFO] Current Student Indexes: {list(idxs.keys())}")
        
        # Drop the problematic index if it exists
        if "enrollmentNumber_1" in idxs:
            students_collection.drop_index("enrollmentNumber_1")
            print("[INFO] Dropped legacy enrollmentNumber index.")
    except Exception as e:
        print(f"[DEBUG] Index cleanup note: {e}")

    print("[INFO] Starting face cache loader in background...")
    threading.Thread(target=load_known_faces, daemon=True).start()

# ==== AUTH ROUTES ====

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/admin/login")
async def login(data: LoginRequest):
    # For demo, allow hardcoded or any existing db admin
    if (data.email == "admin@jspmntc.edu.in" or data.email == "admin@vidya.com") and data.password == "Admin@123":
        return {"user": {"name": "Administrator", "email": data.email, "role": "admin"}}
    
    admin = admin_collection.find_one({"email": data.email, "password": data.password})
    if admin:
        return {"user": {"name": admin.get("name", "Admin"), "email": admin["email"], "role": "admin"}}
    
    raise HTTPException(status_code=401, detail="Invalid Credentials")

# Student Login
class StudentLoginRequest(BaseModel):
    email: str
    rollNo: str

@app.post("/student/login")
async def student_login(data: StudentLoginRequest):
    student = students_collection.find_one({"email": data.email, "rollNo": data.rollNo})
    if not student:
        raise HTTPException(status_code=401, detail="Invalid Email or Roll Number")
    
    return {
        "user": {
            "id": str(student["_id"]),
            "name": student["name"],
            "email": student["email"],
            "rollNo": student["rollNo"],
            "department": student.get("department", "General"),
            "profileImage": student.get("profileImage", ""),
            "role": "student"
        }
    }

@app.get("/student/me/{student_id}")
async def get_student_profile(student_id: str):
    try:
        student = students_collection.find_one({"_id": ObjectId(student_id)})
        if not student:
             raise HTTPException(status_code=404, detail="Student not found")
        
        # Get Attendance Stats (Robust match for both string and ObjectId)
        query = {"$or": [{"studentId": student_id}, {"studentId": ObjectId(student_id)}]}
        attendance_records = list(attendance_collection.find(query).sort("date", -1))
        
        print(f"[DEBUG] Fetching Profile for {student_id}: Found {len(attendance_records)} records")
        
        # Calculate dynamic working days (unique attendance dates in system)
        unique_dates = attendance_collection.distinct("date")
        total_days = max(1, len(unique_dates)) 
        present_days = len(attendance_records)
        percentage = (present_days / total_days * 100)
        
        return {
            "profile": {
                "name": student["name"],
                "rollNo": student["rollNo"],
                "department": student.get("department", "General"),
                "email": student["email"],
                "phone": student.get("phone", ""),
                "profileImage": student.get("profileImage", "")
            },
            "stats": {
                "totalWorkingDays": total_days,
                "presentDays": present_days,
                "absentDays": total_days - present_days,
                "percentage": round(percentage, 1)
            },
            "history": [
                {"date": r["date"], "time": r["time"], "status": "Present"} for r in attendance_records
            ]
        }
    except Exception as e:
         print(e)
         raise HTTPException(status_code=500, detail="Failed to fetch profile")

# ==== STUDENT ROUTES ====

@app.get("/students/")
async def get_students():
    students = list(students_collection.find())
    for s in students:
        s["id"] = str(s["_id"]) # Frontend expects 'id'
        s["_id"] = str(s["_id"])
        if "faceEmbedding" in s: del s["faceEmbedding"]
    return students

class StudentAddRequest(BaseModel):
    name: str
    rollNo: str
    department: str
    email: str
    phone: str
    images: List[str] # List of Base64 strings

@app.post("/students/add")
async def add_student(student: StudentAddRequest):
    if students_collection.find_one({"rollNo": student.rollNo}):
        raise HTTPException(status_code=400, detail="Student already exists")
    if students_collection.find_one({"email": student.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    if not student.images:
        raise HTTPException(status_code=400, detail="No images provided")

    # ---- FACE DEDUPLICATION CHECK (Optional/Experimental) ----
    if len(known_faces) > 0:
        for img_b64 in student.images[:2]: # Check first 2 samples for speed
            try:
                temp_b64 = img_b64.split(",")[1] if "," in img_b64 else img_b64
                temp_arr = np.frombuffer(base64.b64decode(temp_b64), np.uint8)
                temp_img = cv2.imdecode(temp_arr, cv2.IMREAD_COLOR)
                temp_emb = get_face_embedding(temp_img, silent=True)
                
                if temp_emb is not None:
                    for person in known_faces:
                        for stored_emb in person.get("embeddings", []):
                            stored_mat = np.array(stored_emb, dtype=np.float32).reshape((32, 32))
                            score = cv2.compareHist(temp_emb, stored_mat, cv2.HISTCMP_CORREL)
                            if score > 0.8: # Very strict match
                                raise HTTPException(status_code=400, detail=f"Face already registered as {person['name']}")
            except HTTPException as e: raise e
            except: continue

    embeddings = []
    saved_profile_image = ""
    
    # Ensure upload dir exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    print(f"[INFO] Processing {len(student.images)} images for {student.name}")

    for idx, img_b64 in enumerate(student.images):
        try:
            # Decode Base64
            if "," in img_b64:
                img_b64 = img_b64.split(",")[1]
            
            image_data = base64.b64decode(img_b64)
            np_arr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if img is None: continue

            # Generate Embedding
            emb = get_face_embedding(img, silent=True)
            if emb is not None:
                embeddings.append(emb.flatten().tolist())
                
                # Save first valid image as profile picture
                if not saved_profile_image:
                    filename = f"{student.rollNo}_profile.jpg"
                    filepath = os.path.join(UPLOAD_DIR, filename)
                    with open(filepath, "wb") as f:
                        f.write(image_data)
                    saved_profile_image = f"/uploads/{filename}"
            
        except Exception as e:
            print(f"[ERROR] Processing image {idx}: {e}")
            continue

    if not embeddings:
         raise HTTPException(status_code=400, detail="Could not detect face in any provided images")

    student_data = {
        "name": student.name,
        "rollNo": student.rollNo,
        "department": student.department,
        "email": student.email,
        "phone": student.phone,
        "profileImage": saved_profile_image,
        "faceEmbeddings": embeddings, # Store ARRAY of embeddings
        "createdAt": datetime.now()
    }
    
    result = students_collection.insert_one(student_data)
    load_known_faces() # Reload cache
    return {"id": str(result.inserted_id), "message": f"Student added with {len(embeddings)} face samples"}

@app.delete("/students/{id}")
async def delete_student(id: str):
    student = students_collection.find_one({"_id": ObjectId(id)})
    if student:
        # Delete Profile Image from disk
        profile_img = student.get("profileImage")
        if profile_img:
            filename = os.path.basename(profile_img)
            filepath = os.path.join(UPLOAD_DIR, filename)
            if os.path.exists(filepath):
                try: os.remove(filepath)
                except: pass
    
    students_collection.delete_one({"_id": ObjectId(id)})
    load_known_faces() # Reload cache to remove deleted student
    return {"message": "Deleted"}

class StudentUpdateRequest(BaseModel):
    name: str = None
    rollNo: str = None
    department: str = None
    email: str = None
    phone: str = None

@app.put("/students/{id}")
async def update_student(id: str, student: StudentUpdateRequest):
    update_data = {k: v for k, v in student.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Check for duplicate rollNo if changing it
    if "rollNo" in update_data:
        existing = students_collection.find_one({"rollNo": update_data["rollNo"]})
        if existing and str(existing["_id"]) != id:
             raise HTTPException(status_code=400, detail="Roll No already exists")

    result = students_collection.update_one(
        {"_id": ObjectId(id)}, 
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
         raise HTTPException(status_code=404, detail="Student not found or no changes made")
         
    load_known_faces() # Reload cache to update changes (e.g. name)
    return {"message": "Student updated successfully"}

# ==== MODELS ====

class AttendanceRequest(BaseModel):
    image: str

# ==== FACE RECOGNITION (LIVE CHECK) ROUTE ====

@app.post("/face/recognize")
async def recognize_face(data: AttendanceRequest):
    """
    Stand-alone recognition endpoint for 'Live Check' page.
    Does NOT mark attendance.
    """
    if not data.image:
        raise HTTPException(status_code=400, detail="No image")

    try:
        encoded = data.image.split(",", 1)[1] if "," in data.image else data.image
        np_arr = np.frombuffer(base64.b64decode(encoded), np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None: raise HTTPException(status_code=400, detail="Invalid Image")

        target_emb = get_face_embedding(img, silent=True)
        if target_emb is None:
             return {"status": "fail", "message": "No face detected"}

        best_score = 0
        best_match = None
        
        for person in known_faces:
            local_best = 0
            for emb_list in person.get("embeddings", []):
                stored_mat = np.array(emb_list, dtype=np.float32).reshape((32, 32))
                score = cv2.compareHist(target_emb, stored_mat, cv2.HISTCMP_CORREL)
                if score > local_best: local_best = score
            
            if local_best > best_score:
                best_score = local_best
                best_match = person

        if best_match and best_score > SIMILARITY_THRESHOLD:
            # Fetch full details if needed, but for now just return the name/id
            return {
                "status": "success",
                "student": {
                    "name": best_match["name"],
                    "id": best_match["id"],
                },
                "score": round(best_score, 2)
            }
        
        return {"status": "fail", "message": "Unknown Student", "score": round(best_score, 2)}

    except Exception as e:
        print(f"Recognition Error: {e}")
        return {"status": "error", "message": "Server Error"}


@app.post("/attendance/mark")
async def mark_attendance(data: AttendanceRequest):
    if not data.image:
        raise HTTPException(status_code=400, detail="No image")

    try:
        encoded = data.image.split(",", 1)[1] if "," in data.image else data.image
        image_data = base64.b64decode(encoded)
        np_arr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None: raise HTTPException(status_code=400, detail="Invalid Image")

        # Use High-Quality Detection for Verification
        detector_hq = mp.solutions.face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5)
        results = detector_hq.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        
        if not results.detections:
             detector_hq.close()
             raise HTTPException(status_code=400, detail="No face detected. Please position better.")
        
        # Get target embedding
        # We need a robust embedding. Re-using the utility function but ensuring it uses the cropped face
        target_emb = get_face_embedding(img, silent=True)
        if target_emb is None:
             raise HTTPException(status_code=400, detail="Face quality too low")

        best_score = 0
        best_match_id = None
        
        # known_faces stores: { "id": str(_id), "embeddings": [list...], "name": ... }
        for person in known_faces:
            # We compare against all stored embeddings for this person
            person_embeddings = person.get("embeddings", [])
            
            # Legacy support (single 'hist' key?) - No, we migrated everything to standard list
            if not person_embeddings and "hist" in person:
                 # Fallback if somehow old format lingers in memory
                 score = cv2.compareHist(target_emb, person["hist"], cv2.HISTCMP_CORREL)
                 if score > best_score:
                    best_score = score
                    best_match_id = person.get("id")
            
            # New Multi-Embedding Check (Best of Max)
            local_best = 0
            for emb_list in person_embeddings:
                stored_mat = np.array(emb_list, dtype=np.float32).reshape((32, 32))
                score = cv2.compareHist(target_emb, stored_mat, cv2.HISTCMP_CORREL)
                if score > local_best: local_best = score
            
            if local_best > best_score:
                best_score = local_best
                best_match_id = person.get("id")

        detector_hq.close()

        print(f"[FACE AUTH] Best Match ID: {best_match_id} | Score: {best_score:.4f} | Threshold: {SIMILARITY_THRESHOLD}")

        if best_match_id and best_score > SIMILARITY_THRESHOLD:
            # Fetch Student Details
            student = students_collection.find_one({"_id": ObjectId(best_match_id)})
            if not student:
                print(f"[ERROR] Matched ID {best_match_id} but not in DB")
                raise HTTPException(status_code=404, detail="Student record not found")
        else:
             print(f"[AUTH FAIL] Best Score: {best_score} vs Threshold {SIMILARITY_THRESHOLD}")
             msg = f"Face Not Recognized. Score: {best_score:.2f} (Needs {SIMILARITY_THRESHOLD}). Try better lighting."
             if len(known_faces) == 0:
                 msg = "System Error: No student faces loaded in database. Restart Backend."
             raise HTTPException(status_code=401, detail=msg)

        today = datetime.now().strftime("%Y-%m-%d")
        # Robust check for existing record (string or ObjectId)
        existing_query = {
            "$or": [{"studentId": str(student["_id"])}, {"studentId": student["_id"]}], 
            "date": today
        }
        existing = attendance_collection.find_one(existing_query)
        print(f"[DEBUG] Check Existing for {student['name']}: {'Found' if existing else 'Not Found'}")
        
        if not existing:
            new_record = {
                "studentId": str(student["_id"]), 
                "studentName": student["name"],
                "rollNo": student["rollNo"],
                "date": today,
                "time": datetime.now().strftime("%H:%M:%S"),
                "status": "Present"
            }
            res = attendance_collection.insert_one(new_record)
            print(f"[DEBUG] Inserted new record for {student['name']}. ID: {res.inserted_id}")
            return {
                "status": "success", 
                "message": f"Attendance Marked: {student['name']}",
                "student": {"name": student["name"], "rollNo": student["rollNo"]}
            }
        else:
            print(f"[DEBUG] {student['name']} already marked today.")
            return {
                "status": "success", 
                "message": f"Already Marked: {student['name']}",
                "student": {"name": student["name"], "rollNo": student["rollNo"]}
            }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error marking attendance: {e}")
        raise HTTPException(status_code=500, detail="Server Error Processing Image")

@app.get("/attendance/today")
async def get_today():
    today = datetime.now().strftime("%Y-%m-%d")
    records = list(attendance_collection.find({"date": today}))
    print(f"[DEBUG] Today's Attendance Request: Found {len(records)} records for {today}")
    
    # Manual serialization to ensure no ObjectId leaks
    cleaned_records = []
    for r in records:
        r["_id"] = str(r["_id"])
        if "studentId" in r and isinstance(r["studentId"], ObjectId):
             r["studentId"] = str(r["studentId"])
        cleaned_records.append(r)
        
    return cleaned_records

@app.get("/attendance/stats")
async def get_stats():
    today = datetime.now().strftime("%Y-%m-%d")
    total = students_collection.count_documents({})
    present = attendance_collection.count_documents({"date": today})
    print(f"[DEBUG] Stats Request - Today: {today} | Total: {total} | Present: {present}")
    return {
        "totalStudents": total,
        "presentToday": present,
        "absentToday": max(0, total - present),
        "attendancePercentage": round((present / total * 100), 1) if total > 0 else 0
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
