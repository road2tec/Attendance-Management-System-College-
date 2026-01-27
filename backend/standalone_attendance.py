import cv2
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
import mediapipe as mp
import numpy as np
from pymongo import MongoClient
from datetime import datetime

# ==== CONFIGURATIONS ====
MONGO_URI = "mongodb://localhost:27017/vidya-rakshak"
DB_NAME = "vidya-rakshak"
THRESHOLD = 0.65 

# ==== INITIALIZE MEDIAPIPE ====
mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.6
)

# ==== DATABASE SETUP ====
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
students_collection = db["students"]
attendance_collection = db["attendance"]

def get_face_embedding(face_img):
    # Resize to match training/admin capture
    face_img = cv2.resize(face_img, (128, 128))
    hsv_face = cv2.cvtColor(face_img, cv2.COLOR_BGR2HSV)
    # Using 32x32 H-S histogram to match backend/app.py
    hist = cv2.calcHist([hsv_face], [0, 1], None, [32, 32], [0, 180, 0, 256])
    cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX)
    return hist.flatten().tolist()

def compare_embeddings(emb1, emb2):
    v1 = np.array(emb1, dtype=np.float32)
    v2 = np.array(emb2, dtype=np.float32)
    # Reshape to 32x32 as used in backend
    return cv2.compareHist(v1.reshape(32, 32), v2.reshape(32, 32), cv2.HISTCMP_CORREL)

def mark_attendance(student):
    today = datetime.now().strftime("%Y-%m-%d")
    now_time = datetime.now().strftime("%H:%M:%S")
    
    query = {"studentName": student["name"], "date": today}
    if attendance_collection.find_one(query):
        return "Already Marked Today"
    
    attendance_collection.insert_one({
        "studentId": student.get("_id"),
        "studentName": student["name"],
        "rollNo": student.get("rollNo", "N/A"),
        "date": today,
        "time": now_time,
        "status": "Present"
    })
    return f"Attendance Marked: {now_time}"

def start_system():
    print("[INFO] Fetching student embeddings from MongoDB...")
    all_students = list(students_collection.find({}))
    
    if len(all_students) == 0:
        print("[WARNING] No students found in MongoDB!")
        print("[HINT] Register students through the Admin Portal first to generate embeddings.")
    else:
        print(f"[INFO] Loaded {len(all_students)} students.")

    print("[INFO] Starting Webcam... Press 'q' in the window to quit.")
    cap = cv2.VideoCapture(0)
    
    while cap.isOpened():
        success, image = cap.read()
        if not success: break

        image = cv2.flip(image, 1)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = face_detection.process(rgb_image)
        
        status_text = "Scanning..."
        status_color = (255, 255, 255)

        if results.detections:
            for detection in results.detections:
                bbox = detection.location_data.relative_bounding_box
                ih, iw, _ = image.shape
                x, y, w, h = int(bbox.xmin * iw), int(bbox.ymin * ih), \
                             int(bbox.width * iw), int(bbox.height * ih)
                
                x, y = max(0, x), max(0, y)
                face_crop = image[y:y+h, x:x+w]
                
                if face_crop.size > 0:
                    live_embedding = get_face_embedding(face_crop)
                    best_match = None
                    max_score = -1
                    
                    for student in all_students:
                        # Normalize to list of embeddings
                        student_embeddings = []
                        if "faceEmbeddings" in student and student["faceEmbeddings"]:
                            student_embeddings = student["faceEmbeddings"]
                        elif "faceEmbedding" in student and student["faceEmbedding"]:
                            student_embeddings = [student["faceEmbedding"]]
                            
                        # Compare against all stored embeddings for this student
                        for stored_emb in student_embeddings:
                            score = compare_embeddings(live_embedding, stored_emb)
                            if score > max_score:
                                max_score = score
                                best_match = student
                    
                    if max_score > THRESHOLD:
                        name = best_match["name"]
                        status_text = f"{name} ({int(max_score*100)}%)"
                        status_color = (0, 255, 0)
                        result_msg = mark_attendance(best_match)
                        cv2.putText(image, result_msg, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                    else:
                        status_text = "Unknown Face"
                        status_color = (0, 0, 255)

                    cv2.rectangle(image, (x, y), (x + w, y + h), status_color, 2)
                    cv2.putText(image, status_text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, status_color, 2)

        cv2.imshow('Vidya Rakshak - Smart Attendance', image)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    try:
        start_system()
    except Exception as e:
        print(f"[ERROR] {e}")
