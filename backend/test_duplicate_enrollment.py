import requests
import base64
import time

# Read a real face image from artifacts
real_img_path = "/Users/abhijeetgolhar/.gemini/antigravity/brain/5113466a-946f-43b3-a42b-2abbde6601c9/uploaded_media_0_1770036409062.png"
with open(real_img_path, "rb") as f:
    real_b64 = base64.b64encode(f.read()).decode('utf-8')

b64_str = "data:image/png;base64," + real_b64

# 1. Create Student A
print("Creating Student A...")
payload_a = {
    "name": "Original Student",
    "rollNo": "ORIG-001",
    "department": "IT",
    "email": "orig@test.com",
    "phone": "1111111111",
    "images": [b64_str]
}
r = requests.post("http://localhost:8001/students/add", json=payload_a)
print(f"Student A Status: {r.status_code} - {r.text}")

# Wait for training to complete (it runs in background thread)
time.sleep(2)

# 2. Try Create Student B (Same Face)
print("Creating Student B (Duplicate Face)...")
payload_b = {
    "name": "Copycat Student",
    "rollNo": "COPY-002",
    "department": "CS",
    "email": "copy@test.com",
    "phone": "2222222222",
    "images": [b64_str]
}

r = requests.post("http://localhost:8001/students/add", json=payload_b)
print(f"Student B Status: {r.status_code}")
print(f"Response: {r.text}")

if r.status_code == 400 and "Face already registered" in r.text:
    print("SUCCESS: Duplicate face blocked! ✅")
else:
    print("FAILURE: Duplicate face allowed or wrong error! ❌")

# Clean up
# requests.delete(...)
