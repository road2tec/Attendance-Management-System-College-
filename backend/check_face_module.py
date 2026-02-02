import cv2
try:
    print(f"OpenCV Version: {cv2.__version__}")
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    print("LBPH Face Recognizer created successfully!")
except AttributeError:
    print("Error: cv2.face module not found. Is opencv-contrib-python installed?")
except Exception as e:
    print(f"Error: {e}")
