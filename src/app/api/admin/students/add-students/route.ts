import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Student from "@/models/Student";
import dbConfig from "@/config/db.config";
import mailSender from "@/config/mailSender.config";
import fs from "fs";
import ejs from "ejs";
import Semester from "@/models/Semester";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { student } = await req.json();
    const enrollmentNumber = `ENR-${Date.now()}`;
    const registrationNumber = `REG-${Date.now()}`;
    const password = "Password@123";
    const encryptedPassword = await bcrypt.hash(password, 10);
    student.enrollmentNumber = enrollmentNumber;
    student.registrationNumber = registrationNumber;
    student.password = encryptedPassword;
    student.feeDetails = {
      feePerYear: student.feePerYear,
      outstandingFee: student.feePerYear * 4,
    };
    const semesters = await Semester.find({
      department: student.educationDetails.graduation.stream,
      semesterNumber: { $lte: 8 },
    }).sort({ semesterNumber: 1 });
    const semesterDetails = semesters.map((sem: any) => ({
      semesterNumber: sem.semesterNumber,
      subjects: sem.subjects.map((sub: any) => ({
        name: sub.name,
        code: sub.code,
        credits: sub.credits,
        internalMarks: sub.internalMarks,
        externalMarks: sub.externalMarks,
        totalMarks: sub.totalMarks,
      })),
    }));
    student.educationDetails.semesterDetails = semesterDetails;
    const savedStudent = new Student(student);
    await savedStudent.save();
    await sendEmail({
      userName: student.name,
      registrationNumber,
      email: student.email,
    });
    return NextResponse.json(
      { message: "Student Added Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("An Error Occured While Adding Students", error);
    return NextResponse.json(
      { message: "An Error Occured While Adding Students", error },
      { status: 500 }
    );
  }
}

export async function sendEmail(data: {
  userName: string;
  registrationNumber: string;
  email: string;
}) {
  try {
    const template = fs.readFileSync(
      "./src/emailTemplates/welcomeTemplate.ejs",
      "utf-8"
    );
    if (!template) return;
    const html = ejs.render(template, {
      userName: data.userName,
      registrationNumber: data.registrationNumber,
      email: data.email,
    });
    await mailSender(data.email, "Welcome to JSPM's ERP", html);
  } catch (error) {
    console.log("Error Occured While Sending Email", error);
  }
}
