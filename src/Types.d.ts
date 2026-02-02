export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  profileImage?: string;
  department?: string;
  rollNo?: string;
}

export interface Student {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  enrollmentNumber: string;
  department: string;
  year: string;
}
