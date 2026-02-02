import mongoose, { Schema } from "mongoose";

const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  profileImage: { type: String, required: false, default: "" },
  enrollmentNumber: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  department: { type: String, required: true },
});

const Student =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);
export default Student;
