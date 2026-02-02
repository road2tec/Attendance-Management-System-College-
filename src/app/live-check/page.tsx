"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { api, endpoints } from "@/lib/api";
import { IconUser, IconScan, IconCheck, IconX } from "@tabler/icons-react";

export default function LiveCheckPage() {
    const webcamRef = useRef<Webcam>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [lastCheckTime, setLastCheckTime] = useState(0);
    const [matchResult, setMatchResult] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const captureAndCheck = useCallback(async () => {
        if (!webcamRef.current || !isScanning) return;

        // Limit check frequency (every 1.5 seconds)
        const now = Date.now();
        if (now - lastCheckTime < 1500) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        setLastCheckTime(now);

        try {
            const res = await api.post(endpoints.attendance.recognize, { image: imageSrc });

            if (res.data.status === "success") {
                setMatchResult(res.data.student);
                setErrorMsg("");
                // Optional: Pause scanning briefly on success to show result properly
                // setIsScanning(false); 
                // setTimeout(() => setIsScanning(true), 3000); 
            } else {
                setMatchResult(null);
                if (res.data.message === "Unknown Student") {
                    setErrorMsg("Unknown Student");
                } else {
                    setErrorMsg(""); // Clear if it's just "No face detected" to avoid flickering
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [isScanning, lastCheckTime]);

    useEffect(() => {
        const interval = setInterval(captureAndCheck, 1000); // Trigger check loop
        return () => clearInterval(interval);
    }, [captureAndCheck]);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Camera Feed */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-700 aspect-video bg-black">
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: "user" }}
                        mirrored={true}
                    />

                    <div className="absolute inset-0 bg-scan-overlay pointer-events-none opacity-30"></div>

                    {/* Scanning Overlay */}
                    <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full flex items-center gap-2 text-green-400 text-xs font-mono uppercase tracking-widest animate-pulse">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Live Face Recognition
                    </div>
                </div>

                {/* Info Panel */}
                <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 min-h-[400px] flex flex-col justify-center text-center">

                    {matchResult ? (
                        <div className="space-y-6 animate-fade-in">
                            <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-tr from-green-400 to-teal-500 relative">
                                <img
                                    src={matchResult.profileImage ? `http://localhost:8001${matchResult.profileImage}` : "https://ui-avatars.com/api/?name=" + matchResult.name}
                                    className="w-full h-full rounded-full object-cover border-4 border-gray-800"
                                />
                                <div className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full border-4 border-gray-800">
                                    <IconCheck size={24} />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-white mb-1">{matchResult.name}</h2>
                                <div className="inline-block px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm mb-4">
                                    {matchResult.department}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 text-left bg-gray-700/50 p-6 rounded-xl">
                                <div>
                                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Email ID</div>
                                    <div className="text-white font-mono">{matchResult.email}</div>
                                </div>
                                <div>
                                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Mobile Number</div>
                                    <div className="text-white font-mono">{matchResult.phone}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                            {errorMsg === "Unknown Student" ? (
                                <div className="text-red-500 animate-pulse">
                                    <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                        <IconX size={48} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Unknown Student</h3>
                                    <p className="text-gray-400 text-sm mt-2">Face detected but no match found in database.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-24 h-24 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                        <IconScan size={48} className="opacity-50" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-400">Waiting for Face...</h3>
                                    <p className="text-xs text-gray-600 max-w-xs mx-auto">Please look directly at the camera for identification.</p>
                                </>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
