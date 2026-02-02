import { exec } from "child_process";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/config/db.config";
import Student from "@/models/Student";

const execAsync = promisify(exec);

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { newStudent } = await req.json();
    const existingStudent = await Student.findOne({
      email: newStudent.email,
    });
    if (existingStudent) {
      return NextResponse.json(
        { message: "Student with this Email already exists" },
        { status: 400 }
      );
    }
    const { stdout } = await execAsync(
      `py -3.12 python/enroll_student.py "${newStudent.email}"`
    );
    if (stdout.includes("Capture cancelled.")) {
      return NextResponse.json(
        { message: "Image capture cancelled by user." },
        { status: 400 }
      );
    }
    await execAsync("py -3.12 python/encoding.py");
    const student = new Student(newStudent);
    await student.save();
    return NextResponse.json(
      { message: "Student added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in POST /api/students/add-student", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
