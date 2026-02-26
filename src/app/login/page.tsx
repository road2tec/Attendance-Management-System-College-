"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, endpoints } from "@/lib/api";
import { IconEye, IconEyeOff, IconRefresh } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
    const { login } = useAuth();
    const [loginMode, setLoginMode] = useState<'admin' | 'student'>('admin');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Captcha State
    const [captcha, setCaptcha] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (captchaInput !== captcha) {
            toast.error("Invalid Captcha! Please try again.");
            generateCaptcha();
            setCaptchaInput("");
            return;
        }

        setLoading(true);

        try {
            let res;
            if (loginMode === 'admin') {
                res = await api.post(endpoints.auth.login, { email, password });
            } else {
                res = await api.post(endpoints.auth.studentLogin, { email, rollNo });
            }

            if (res.data.user) {
                toast.success("Login Successful!");
                login(res.data.user);
            }
        } catch (err: any) {
            console.error("Login Error:", err);

            // Demo Fallback for Admin
            if (loginMode === 'admin' && email === "admin@sinhgad.edu" && password === "Admin@123") {
                toast.success("Login Successful (Demo Admin)!");
                login({ name: "Admin User", email: email, role: "admin", profileImage: "" } as any);
            }
            // Demo Fallback for Student
            else if (loginMode === 'student' && email.includes("@") && rollNo.startsWith("DEMO")) {
                toast.success("Login Successful (Demo Student)!");
                login({
                    id: "demo-student-id",
                    name: "Demo Student",
                    email: email,
                    rollNo: rollNo,
                    role: "student",
                    profileImage: "",
                    department: "Computer Engineering"
                } as any);
            }
            else {
                toast.error(err.response?.data?.detail || "Invalid credentials or Server Error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* Left Side: College Info */}
            <div className="md:w-[35%] bg-[#8B1A1A] text-white p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Logo Placeholder */}
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg text-center p-2">
                    <span className="text-[#1A365D] text-2xl font-bold leading-none">SCOE PUNE</span>
                </div>

                <p className="uppercase tracking-widest text-sm mb-2 opacity-80">Sinhgad Technical Education Society&apos;s</p>
                <h1 className="text-3xl font-bold mb-4 leading-tight">
                    Sinhgad College Of <br /> Engineering, Pune
                </h1>
                <p className="text-sm opacity-80 mb-6 max-w-sm">
                    S. No. 44/1, Vadgaon (Bk), Off Sinhgad Road, Pune - 411041
                </p>

                <div className="text-xs space-y-1 opacity-70 border-t border-white/20 pt-6 mt-2 w-full max-w-xs">
                    <p>Approved by AICTE New Delhi, Affiliated to Savitribai Phule Pune University (SPPU)</p>
                    <p>Recognised by Govt. of Maharashtra, DTE Mumbai.</p>
                    <p className="font-semibold text-yellow-300">DTE Code 6177 | NAAC : A+ Grade | NBA Accredited | ISO 9001: 2015</p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="md:w-[65%] relative bg-gray-200">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    className="absolute inset-0 bg-gradient-to-br from-[#1A365D] to-[#8B1A1A] opacity-20"
                >
                    <div className="absolute inset-0 bg-black/20"></div> {/* Overlay */}
                </div>

                {/* Login Card */}
                <div className="relative z-10 h-full flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login to Your Account</h2>

                        {/* Toggle Tabs */}
                        <div role="tablist" className="tabs tabs-boxed mb-6 bg-gray-100 p-1">
                            <a role="tab"
                                className={`tab transition-all duration-300 ${loginMode === 'admin' ? 'tab-active bg-teal-600 text-white shadow-md' : 'text-gray-500'}`}
                                onClick={() => setLoginMode('admin')}
                            >
                                Admin Login
                            </a>
                            <a role="tab"
                                className={`tab transition-all duration-300 ${loginMode === 'student' ? 'tab-active bg-teal-600 text-white shadow-md' : 'text-gray-500'}`}
                                onClick={() => setLoginMode('student')}
                            >
                                Student Login
                            </a>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-semibold text-gray-700 text-xs">Email <span className="text-red-500">*</span></span>
                                </label>
                                <input
                                    type="email"
                                    placeholder={loginMode === 'admin' ? "admin@sinhgad.edu" : "student@example.com"}
                                    className="input input-bordered w-full bg-gray-50 focus:border-teal-500 focus:bg-white transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password / Roll No */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-semibold text-gray-700 text-xs">
                                        {loginMode === 'admin' ? "Password" : "Roll Number"}
                                        <span className="text-red-500"> *</span>
                                    </span>
                                </label>
                                {loginMode === 'admin' ? (
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter Password"
                                            className="input input-bordered w-full bg-gray-50 focus:border-teal-500 focus:bg-white pr-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="e.g. CS-2024-01"
                                        className="input input-bordered w-full bg-gray-50 focus:border-teal-500 focus:bg-white"
                                        value={rollNo}
                                        onChange={(e) => setRollNo(e.target.value)}
                                        required
                                    />
                                )}
                            </div>

                            {/* Captcha */}
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-semibold text-gray-700 text-xs">Captcha</span>
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <div className="flex-1 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center font-mono text-xl tracking-widest font-bold text-gray-600 select-none bg-opacity-50"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiLz4KPC9zdmc+")' }}>
                                        {captcha}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateCaptcha}
                                        className="btn btn-square btn-neutral bg-black hover:bg-gray-800 text-white"
                                    >
                                        <IconRefresh size={20} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Captcha"
                                    className="input input-bordered w-full bg-gray-50 focus:border-teal-500"
                                    value={captchaInput}
                                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                                    required
                                />
                            </div>

                            {/* Footer Checks */}
                            <div className="flex items-center justify-between text-xs">
                                <label className="cursor-pointer flex items-center gap-2">
                                    <input type="checkbox" className="checkbox checkbox-xs rounded-sm" />
                                    <span className="text-gray-600">Remember Me</span>
                                </label>
                                <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn w-full bg-[#758CA3] hover:bg-[#5e7185] text-white border-none shadow-md mt-4 text-sm font-normal normal-case h-11"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : (loginMode === 'admin' ? "Admin Login" : "Student Login")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Toaster position="top-center" />
        </div>
    );
}
