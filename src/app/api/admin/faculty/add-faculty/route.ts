import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConfig from "@/config/db.config";
import Faculty from "@/models/Faculty";
import HOD from "@/models/HOD";
import { sendEmail } from "../../students/add-students/route";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { faculty } = await req.json();
    const encryptedPassword = await bcrypt.hash("Password@123", 10);
    faculty.password = encryptedPassword;
    if (faculty.designation === "Assistant Professor") {
      const newFaculty = new Faculty(faculty);
      await newFaculty.save();
      await sendEmail({
        userName: faculty.name,
        registrationNumber: faculty.facultyId,
        email: faculty.email,
      });
      return NextResponse.json(
        { message: "Faculty added successfully", faculty: newFaculty },
        { status: 201 }
      );
    } else {
      faculty.hodId = faculty.facultyId;
      const newHod = new HOD(faculty);
      await newHod.save();
      await sendEmail({
        userName: faculty.name,
        registrationNumber: faculty.facultyId || faculty.hodId,
        email: faculty.email,
      });
      return NextResponse.json(
        { message: "HOD added successfully", hod: newHod },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("An error occurred while adding faculty:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
