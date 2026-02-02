from pymongo import MongoClient
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["vidya-rakshak"]
students = db["students"]

res = students.delete_many({"rollNo": {"$in": ["ORIG-001", "COPY-002"]}})
print(f"Deleted {res.deleted_count} test students.")
