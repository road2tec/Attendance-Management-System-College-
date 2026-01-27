"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, endpoints } from "@/lib/api";
import { IconUser, IconCalendarStats, IconCheck, IconX, IconClock, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import toast from "react-hot-toast";

export default function StudentDashboardPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Webcam State
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const webcamRef = useRef<Webcam>(null);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login");
            } else if (user.role !== "student") {
                router.push("/admin/dashboard");
            } else {
                fetchProfile();
                // Auto-refresh stats every 10 seconds
                const interval = setInterval(fetchProfile, 10000);
                return () => clearInterval(interval);
            }
        }
    }, [user, isLoading]);

    const fetchProfile = async () => {
        if (!user?.id) return;
        try {
            const res = await api.get(endpoints.student.profile(user.id));
            setProfileData(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    const captureAndMark = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                toast.error("Camera not ready. Please wait a moment.");
                return;
            }

            setVerifying(true);
            try {
                // console.log("Sending image to backend...", imageSrc.substring(0, 50) + "...");
                await api.post(endpoints.attendance.mark, { image: imageSrc });
                toast.success("Attendance Marked Successfully!");
                setIsCameraOpen(false);
                fetchProfile(); // Refresh stats
            } catch (err: any) {
                console.error("Attendance Error:", err);
                if (err.response) {
                    // Server responded with a status code outside 2xx
                    toast.error(err.response.data?.detail || "Verification Failed. Try Again.");
                } else if (err.request) {
                    // Request made but no response (Network Error)
                    toast.error("Network Error: Cannot reach server. Please check your backend terminal.");
                } else {
                    toast.error("Error setting up request.");
                }
            } finally {
                setVerifying(false);
            }
        } else {
            toast.error("Webcam not initialized");
        }
    };

    if (isLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-teal-600"></span>
        </div>;
    }

    if (!profileData) return null;

    const { profile, stats, history } = profileData;

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-6xl mx-auto space-y-8 relative">

                {/* Logout Button */}
                <div className="absolute top-0 right-0 z-10">
                    <button
                        onClick={logout}
                        className="btn btn-sm btn-ghost text-gray-500 hover:text-red-500 gap-2"
                    >
                        <IconLogout size={16} /> Logout
                    </button>
                </div>

                {/* Header / Profile Card */}
                <div className="card bg-white shadow-xl border-l-4 border-teal-600">
                    <div className="card-body flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="avatar">
                            <div className="w-24 h-24 rounded-full ring ring-teal-600 ring-offset-base-100 ring-offset-2">
                                {profile.profileImage ? (
                                    <img src={`http://localhost:8001${profile.profileImage}`} alt="Profile" />
                                ) : (
                                    <div className="bg-gray-200 w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                                        {profile.name[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="badge badge-lg badge-neutral">{profile.rollNo}</span>
                                <span className="badge badge-lg badge-ghost">{profile.department}</span>
                            </div>
                            <div className="text-gray-500 text-sm flex gap-4 justify-center md:justify-start mt-2">
                                <span className="flex items-center gap-1"><IconUser size={16} /> {profile.email}</span>
                                {profile.phone && <span>{profile.phone}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[150px]">
                            <div className="flex flex-col items-center justify-center bg-teal-50 p-4 rounded-xl">
                                <span className="text-sm font-semibold text-teal-800">Attendance</span>
                                <span className={`text-4xl font-extrabold ${stats.percentage < 75 ? 'text-rose-600' : 'text-teal-600'}`}>
                                    {stats.percentage}%
                                </span>
                                <span className="text-xs text-gray-500">Overall</span>
                            </div>
                            <button
                                onClick={() => setIsCameraOpen(true)}
                                className="btn btn-primary bg-teal-600 border-none hover:bg-teal-700 w-full text-white"
                            >
                                Mark Attendance
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mark Attendance Modal */}
                {isCameraOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="card w-full max-w-lg bg-white shadow-2xl">
                            <div className="card-body text-center">
                                <h3 className="card-title justify-center text-gray-800 mb-4">Mark Your Attendance</h3>
                                <div className="border-4 border-teal-100 rounded-xl overflow-hidden mb-4">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        screenshotQuality={0.8}
                                        className="w-full"
                                        videoConstraints={{ facingMode: "user", width: 400, height: 400 }}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mb-4">Please position your face clearly in the frame.</p>

                                <div className="flex justify-center gap-3">
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setIsCameraOpen(false)}
                                        disabled={verifying}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary bg-teal-600 border-none hover:bg-teal-700 text-white min-w-[120px]"
                                        onClick={captureAndMark}
                                        disabled={verifying}
                                    >
                                        {verifying ? <span className="loading loading-spinner"></span> : "Verify & Mark"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card bg-white shadow-sm p-6 flex flex-row items-center gap-4 border border-teal-100/50">
                        <div className="p-3 rounded-full bg-teal-100 text-teal-600"><IconCheck size={32} /></div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Present Days</h3>
                            <p className="text-3xl font-bold text-gray-800">{stats.presentDays}</p>
                        </div>
                    </div>
                    <div className="card bg-white shadow-sm p-6 flex flex-row items-center gap-4 border border-rose-100/50">
                        <div className="p-3 rounded-full bg-rose-100 text-rose-600"><IconX size={32} /></div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Absent Days</h3>
                            <p className="text-3xl font-bold text-gray-800">{stats.absentDays}</p>
                        </div>
                    </div>
                    <div className="card bg-white shadow-sm p-6 flex flex-row items-center gap-4 border border-blue-100/50">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600"><IconCalendarStats size={32} /></div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Total Working Days</h3>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalWorkingDays}</p>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <div className="card bg-white shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-gray-700 mb-4 flex items-center gap-2">
                            <IconClock className="text-teal-600" /> Recent Activity
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-8 text-gray-400">No attendance records found.</td>
                                        </tr>
                                    ) : (
                                        history
                                            .sort((a: any, b: any) => new Date(b.date + " " + (b.time || "00:00")).getTime() - new Date(a.date + " " + (a.time || "00:00")).getTime())
                                            .map((record: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-base-50">
                                                    <td className="font-medium">{record.date}</td>
                                                    <td className="font-mono text-sm">{record.time || "N/A"}</td>
                                                    <td><span className="badge badge-success badge-sm gap-1"><IconCheck size={12} /> Present</span></td>
                                                </tr>
                                            ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
