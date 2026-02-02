"use client";
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { api, endpoints } from "@/lib/api";
import { IconCamera, IconCheck, IconX } from "@tabler/icons-react";

export default function StudentAttendancePage() {
    const webcamRef = useRef<Webcam>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ status: string; message: string; student?: any } | null>(null);

    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await api.post(endpoints.attendance.mark, { image: imageSrc });
            setResult(response.data);
        } catch (error) {
            setResult({ status: "failed", message: "Face not recognized or server error." });
        } finally {
            setLoading(false);
            // Reset result after 3 seconds
            setTimeout(() => setResult(null), 3000);
        }
    }, [webcamRef]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-green-100 p-4">
            <div className="card w-full max-w-lg bg-base-100 shadow-xl overflow-hidden">
                <div className="card-body p-0">
                    <div className="relative h-96 bg-black">
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover"
                            videoConstraints={{ facingMode: "user" }}
                        />

                        {/* Overlay Grid/Frame */}
                        <div className="absolute inset-0 border-4 border-teal-500/30 pointer-events-none"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-white/50 rounded-lg"></div>

                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                <span className="loading loading-spinner loading-lg text-teal-500"></span>
                            </div>
                        )}

                        {result && (
                            <div className={`absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-sm ${result.status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                <div className={`p-6 rounded-full ${result.status === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white mb-4 animate-bounce`}>
                                    {result.status === 'success' ? <IconCheck size={48} /> : <IconX size={48} />}
                                </div>
                                <h2 className="text-2xl font-bold text-white shadow-black drop-shadow-md">{result.message}</h2>
                            </div>
                        )}
                    </div>

                    <div className="p-6 text-center">
                        <h2 className="card-title justify-center text-2xl mb-2 text-teal-800">Smart Attendance</h2>
                        <p className="text-gray-500 mb-6">Align your face within the frame</p>
                        <button
                            onClick={capture}
                            disabled={loading}
                            className="btn btn-primary btn-lg w-full bg-teal-600 hover:bg-teal-700 border-none text-white gap-2"
                        >
                            <IconCamera /> Mark Attendance
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-sm text-teal-700 font-medium opacity-70">
                Vidya Rakshak Verification System
            </div>
        </div>
    );
}
