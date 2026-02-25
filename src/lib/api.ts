import axios from "axios";

const API_URL = "http://127.0.0.1:8001";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const endpoints = {
    auth: {
        login: "/admin/login",
        studentLogin: "/student/login",
    },
    student: {
        profile: (id: string) => `/student/me/${id}`,
    },
    students: {
        getAll: "/students/",
        add: "/students/add",
        delete: (id: string) => `/students/${id}`,
        update: (id: string) => `/students/${id}`,
    },
    attendance: {
        mark: "/attendance/mark",
        recognize: "/face/recognize",
        today: "/attendance/today",
        stats: "/attendance/stats",
    },
};
