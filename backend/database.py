from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/vidya-rakshak")
DB_NAME = "vidya-rakshak"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

students_collection = db["students"]
attendance_collection = db["attendance"]
admin_collection = db["admins"]
