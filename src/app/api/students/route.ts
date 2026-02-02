import Student from "@/models/Student";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await Student.find({});
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.log("Error while fetching students", error);
    return NextResponse.json(
      { message: "Error while fetching students" },
      { status: 500 }
    );
  }
}
