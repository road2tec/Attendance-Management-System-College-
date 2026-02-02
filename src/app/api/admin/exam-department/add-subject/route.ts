import Courses from "@/models/Courses";
import Semester from "@/models/Semester";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();
    const semester = await Semester.findOne({
      department: subject.department,
      semesterNumber: subject.semesterNumber,
    });
    if (!semester) {
      return NextResponse.json(
        { error: "Semester not found" },
        { status: 404 }
      );
    }
    semester.subjects.push({
      name: subject.name,
      code: subject.code,
      credits: subject.credits,
      internalMarks: subject.internalMarks || 0,
      externalMarks: subject.externalMarks || 0,
      totalMarks: subject.internalMarks + subject.externalMarks || 0,
    });
    // await semester.save();
    const newCourse = new Courses({
      name: subject.name,
      code: subject.code,
      credits: subject.credits,
      department: subject.department,
      facultyId: subject.facultyId,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    });
    await newCourse.save();
    return NextResponse.json(
      { message: "Subject added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("An Error Occurred while adding subject", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
