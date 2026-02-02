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
import base64
import shutil
import threading
from typing import List, Dict
from datetime import datetime
from pymongo import MongoClient
import glob
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# ==== CONFIG ====
STUDENT_IMAGES_DIR = "backend/Student_Images"
UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(STUDENT_IMAGES_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

from .database import students_collection, attendance_collection, admin_collection, MONGO_URI

# ==== FACE RECOGNITION SETUP (LBPH) ====
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Check if contrib is available
try:
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    print("[INFO] LBPH Face Recognizer Initialized.")
except AttributeError:
    print("[ERROR] cv2.face not found. Falling back to simple histogram (Low Accuracy).")
    recognizer = None

# Global State for Recognition
label_map: Dict[int, str] = {} # { int_label: student_id_str }
model_trained = False

# ==== CORS ====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==== HELPER FUNCTIONS ====

def get_face_roi(image):
    """
    Returns the detected face region (grayscale) or None.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    if len(faces) == 0:
        # Fallback: Center Crop
        h, w = gray.shape
        cy, cx = h // 2, w // 2
        crop_h, crop_w = min(h, 200), min(w, 200)
        y = cy - crop_h // 2
        x = cx - crop_w // 2
        return gray[y:y+crop_h, x:x+crop_w]
    
    # Largest Face
    faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
    x, y, w, h = faces[0]
    return gray[y:y+h, x:x+w]

def train_model():
    global label_map, model_trained
    print("[INFO] Starting Model Training...")
    
    faces = []
    labels = []
    current_label = 0
    new_label_map = {}
    
    # Iterate over student folders
    if not os.path.exists(STUDENT_IMAGES_DIR):
        print("[WARNING] No Student_Images directory found.")
        return

    student_folders = os.listdir(STUDENT_IMAGES_DIR)
    
    for folder_name in student_folders:
        folder_path = os.path.join(STUDENT_IMAGES_DIR, folder_name)
        if not os.path.isdir(folder_path): continue
        
        # Folder name is usually rollNo or Name, but we need ID to map back.
        # Ideally, folder name should be the Student ID.
        # But for now, we rely on finding the student by RollNo (folder name)
        student = students_collection.find_one({"rollNo": folder_name})
        if not student:
            print(f"[WARNING] Skipping folder {folder_name}: No matching student in DB")
            continue
            
        student_id = str(student["_id"])
        
        # Assign a unique integer label to this student
        new_label_map[current_label] = student_id
        
        image_paths = glob.glob(os.path.join(folder_path, "*.*"))
        for img_path in image_paths:
            img = cv2.imread(img_path)
            if img is None: continue
            
            face_roi = get_face_roi(img)
            if face_roi is not None:
                faces.append(cv2.resize(face_roi, (100, 100)))
                labels.append(current_label)
        
        current_label += 1

    if len(faces) > 0:
        recognizer.train(faces, np.array(labels))
        label_map = new_label_map
        model_trained = True
        print(f"[INFO] Model Trained with {len(faces)} samples for {len(label_map)} students.")
    else:
        print("[WARNING] No training data found.")
        model_trained = False

@app.on_event("startup")
async def startup_event():
    print("[INFO] Server Startup. Initializing Training...")
    threading.Thread(target=train_model, daemon=True).start()

@app.get("/health")
async def health():
    return {"status": "ok", "model_trained": model_trained}

# ==== AUTH ROUTES ====

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/admin/login")
async def login(data: LoginRequest):
    if (data.email == "admin@vidya.com" or data.email == "admin@sbpcoe.ac.in") and data.password == "admin123":
        return {"user": {"name": "Administrator", "email": data.email, "role": "admin"}}
    
    admin = admin_collection.find_one({"email": data.email, "password": data.password})
    if admin:
        return {"user": {"name": admin.get("name", "Admin"), "email": admin["email"], "role": "admin"}}
    
    raise HTTPException(status_code=401, detail="Invalid Credentials")

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
        if not student: raise HTTPException(status_code=404, detail="Student not found")
        
        query = {"$or": [{"studentId": student_id}, {"studentId": ObjectId(student_id)}]}
        attendance_records = list(attendance_collection.find(query).sort("date", -1))
        
        total_days = 30
        present_days = len(attendance_records)
        percentage = (present_days / total_days * 100) if total_days > 0 else 0
        
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
            "history": [{"date": r["date"], "time": r["time"], "status": "Present"} for r in attendance_records]
        }
    except Exception as e:
         print(e)
         raise HTTPException(status_code=500, detail="Failed to fetch profile")

# ==== RECOGNIZE ROUTE ====

class AttendanceRequest(BaseModel):
    image: str

@app.post("/face/recognize")
async def recognize_face(data: AttendanceRequest):
    if not data.image: raise HTTPException(status_code=400, detail="No image")
    if not model_trained: return {"status": "fail", "message": "System Training... Please wait."}

    try:
        encoded = data.image.split(",", 1)[1] if "," in data.image else data.image
        np_arr = np.frombuffer(base64.b64decode(encoded), np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None: raise HTTPException(status_code=400, detail="Invalid Image")

        face_roi = get_face_roi(img)
        if face_roi is None:
             return {"status": "fail", "message": "No face detected"}

        # Predict
        face_roi = cv2.resize(face_roi, (100, 100))
        label, confidence = recognizer.predict(face_roi)
        
        print(f"[RECOGNIZE] Label: {label}, Conf: {confidence}")

        # LBPH Confidence: Lower is better (distance).
        # Threshold: 100 is generally safe for small datasets with varying lighting.
        if confidence < 110: 
            student_id = label_map.get(label)
            if student_id:
                student = students_collection.find_one({"_id": ObjectId(student_id)})
                if student:
                    return {
                        "status": "success",
                        "student": {
                            "name": student["name"],
                            "email": student["email"],
                            "department": student.get("department", "General"),
                            "profileImage": student.get("profileImage", "")
                        },
                        "score": round(confidence, 2)
                    }
        
        return {"status": "fail", "message": "Unknown Student", "debug_conf": confidence}

    except Exception as e:
        print(f"Recognition Error: {e}")
        return {"status": "error", "message": "Server Error"}

# ==== ATTENDANCE ROUTE ====

@app.post("/attendance/mark")
async def mark_attendance(data: AttendanceRequest):
    if not data.image: raise HTTPException(status_code=400, detail="No image")
    if not model_trained: raise HTTPException(status_code=503, detail="System Training... Please wait.")

    try:
        encoded = data.image.split(",", 1)[1] if "," in data.image else data.image
        np_arr = np.frombuffer(base64.b64decode(encoded), np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None: raise HTTPException(status_code=400, detail="Invalid Image")

        face_roi = get_face_roi(img)
        if face_roi is None: raise HTTPException(status_code=400, detail="No face detected")

        # Predict
        face_roi = cv2.resize(face_roi, (100, 100))
        label, confidence = recognizer.predict(face_roi)
        
        print(f"[MARK] Label: {label}, Conf: {confidence}")

        if confidence < 110:
            student_id = label_map.get(label)
            if not student_id: raise HTTPException(status_code=404, detail="Recognized ID not currently mapped")
            
            student = students_collection.find_one({"_id": ObjectId(student_id)})
            if not student: raise HTTPException(status_code=404, detail="Student record not found")
            
            today = datetime.now().strftime("%Y-%m-%d")
            query = {"$or": [{"studentId": str(student["_id"])}, {"studentId": student["_id"]}], "date": today}
            
            if not attendance_collection.find_one(query):
                attendance_collection.insert_one({
                    "studentId": str(student["_id"]), 
                    "studentName": student["name"],
                    "rollNo": student["rollNo"],
                    "date": today,
                    "time": datetime.now().strftime("%H:%M:%S"),
                    "status": "Present"
                })
                return {"status": "success", "message": f"Attendance Marked: {student['name']}", "student": {"name": student["name"]}}
            else:
                return {"status": "success", "message": f"Already Marked: {student['name']}", "student": {"name": student["name"]}}
        
        raise HTTPException(status_code=401, detail="Face Not Recognized")

    except ValueError:
        raise HTTPException(status_code=401, detail="Face Not Recognized")
    except Exception as e:
        print(f"Error marking attendance: {e}")
        raise HTTPException(status_code=500, detail="Server Error")

# ==== STUDENT ROUTES ====

@app.get("/students/")
async def get_students():
    students = list(students_collection.find())
    for s in students:
        s["id"] = str(s["_id"])
        s["_id"] = str(s["_id"])
    return students

class StudentAddRequest(BaseModel):
    name: str
    rollNo: str
    department: str
    email: str
    phone: str
    images: List[str]

@app.post("/students/add")
async def add_student(student: StudentAddRequest):
    if students_collection.find_one({"rollNo": student.rollNo}):
        raise HTTPException(status_code=400, detail="Student already exists")
    if students_collection.find_one({"email": student.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    if not student.images:
        raise HTTPException(status_code=400, detail="No images provided")

    # Save logic
    student_dir = os.path.join(STUDENT_IMAGES_DIR, student.rollNo)
    os.makedirs(student_dir, exist_ok=True)
    
    saved_count = 0
    saved_profile_image = ""

    # Check for Duplicate Face Logic
    print(f"[DEBUG] Model Trained Status: {model_trained}")
    if model_trained:
        # Check ALL images to be safe
        for img_b64 in student.images:
            try:
                check_img_b64 = img_b64
                if "," in check_img_b64: check_img_b64 = check_img_b64.split(",")[1]
                image_data = base64.b64decode(check_img_b64)
                np_arr = np.frombuffer(image_data, np.uint8)
                img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
                
                if img is None:
                    print("[DEBUG-DEDUPE] Image Decode Failed (None)")
                    continue
                
                print(f"[DEBUG-DEDUPE] Img Shape: {img.shape}")
                face_roi = get_face_roi(img)
                if face_roi is None:
                    print("[DEBUG-DEDUPE] Get Face ROI returned None")
                else:
                    face_roi = cv2.resize(face_roi, (100, 100))
                    label, confidence = recognizer.predict(face_roi)
                    print(f"[DEBUG-DEDUPE] Label: {label}, Conf: {confidence}")
                    
                    # Match high confidence (low distance). Sync with Live Check threshold (110)
                    if confidence < 100: 
                        existing_id = label_map.get(label)
                        print(f"[DEBUG-DEDUPE] Match Found: {existing_id}")
                        if existing_id:
                            existing_student = students_collection.find_one({"_id": ObjectId(existing_id)})
                            if existing_student:
                                raise HTTPException(
                                    status_code=400, 
                                    detail=f"Face already registered as '{existing_student['name']}' ({existing_student.get('rollNo')})"
                                )
            except HTTPException as he:
                raise he
            except Exception as e:
                print(f"[WARNING] Face Dedupe Check Failed: {e}")

    for idx, img_b64 in enumerate(student.images):
        try:
            if "," in img_b64: img_b64 = img_b64.split(",")[1]
            image_data = base64.b64decode(img_b64)
            
            # Save for Training
            filename = f"sample_{idx}.jpg"
            filepath = os.path.join(student_dir, filename)
            with open(filepath, "wb") as f: f.write(image_data)
            
            # Set Profile Image
            if idx == 0:
                public_filename = f"{student.rollNo}_profile.jpg"
                public_path = os.path.join(UPLOAD_DIR, public_filename)
                with open(public_path, "wb") as f: f.write(image_data)
                saved_profile_image = f"/uploads/{public_filename}"
            
            saved_count += 1
        except Exception as e:
            print(f"[ERROR] Saving image {idx}: {e}")

    if saved_count == 0:
         raise HTTPException(status_code=400, detail="Failed to save any images")

    student_data = {
        "name": student.name,
        "rollNo": student.rollNo,
        "department": student.department,
        "email": student.email,
        "phone": student.phone,
        "profileImage": saved_profile_image,
        "createdAt": datetime.now()
    }
    
    result = students_collection.insert_one(student_data)
    
    # Trigger Retraining Background
    threading.Thread(target=train_model, daemon=True).start()
    
    return {"id": str(result.inserted_id), "message": f"Student added and System Retraining..."}

@app.delete("/students/{id}")
async def delete_student(id: str):
    # Get student to find rollNo (foldern ame)
    student = students_collection.find_one({"_id": ObjectId(id)})
    if student:
        # 1. Delete Training Data Folder
        rollNo = student.get("rollNo")
        if rollNo:
             shutil.rmtree(os.path.join(STUDENT_IMAGES_DIR, rollNo), ignore_errors=True)
        
        # 2. Delete Profile Image from Public Uploads
        profile_image_url = student.get("profileImage")
        if profile_image_url:
            # URL is like "/uploads/filename.jpg" -> We need filename
            filename = os.path.basename(profile_image_url)
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    print(f"[INFO] Deleted profile image: {file_path}")
                except Exception as e:
                    print(f"[ERROR] Could not delete profile image: {e}")

    students_collection.delete_one({"_id": ObjectId(id)})
    threading.Thread(target=train_model, daemon=True).start()
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
    if not update_data: raise HTTPException(status_code=400, detail="No fields")

    result = students_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.modified_count == 0: raise HTTPException(status_code=404, detail="Not Found")
    
    return {"message": "Student updated"}

@app.get("/attendance/today")
async def get_today():
    today = datetime.now().strftime("%Y-%m-%d")
    records = list(attendance_collection.find({"date": today}))
    for r in records: 
        r["_id"] = str(r["_id"])
        if isinstance(r.get("studentId"), ObjectId): r["studentId"] = str(r["studentId"])
    return records

@app.get("/attendance/stats")
async def get_stats():
    today = datetime.now().strftime("%Y-%m-%d")
    total = students_collection.count_documents({})
    present = attendance_collection.count_documents({"date": today})
    return {
        "totalStudents": total,
        "presentToday": present,
        "absentToday": max(0, total - present),
        "attendancePercentage": round((present / total * 100), 1) if total > 0 else 0
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
