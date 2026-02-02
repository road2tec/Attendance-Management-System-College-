import dbConfig from "@/config/db.config";
import Semester from "@/models/Semester";
import { NextResponse } from "next/server";

dbConfig();

const departments = [
  "Computer Engineering",
  "Information Technology",
  "Electronics and Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

export async function GET() {
  try {
    const semesters = await Semester.find().lean();
    if (semesters.length === 0) {
      for (const dept of departments) {
        for (let i = 1; i <= 8; i++) {
          const exists = await Semester.findOne({
            department: dept,
            semesterNumber: i,
          });
          if (!exists) {
            await Semester.create({
              department: dept,
              semesterNumber: i,
              subjects: [],
            });
          }
        }
      }
      return NextResponse.json(
        { message: "Semesters initialized successfully", semesters: [] },
        { status: 201 }
      );
    }
    return NextResponse.json({ semesters }, { status: 200 });
  } catch (error) {
    console.log("An Error Occurred while initializing semesters", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
