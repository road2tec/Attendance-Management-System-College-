"use client";
import { useEffect, useState } from "react";
import {
  IconExclamationMark,
  IconEye,
  IconEyeOff,
  IconMarquee,
} from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captchaInput: "",
  });
  const genereateCaptcha = () => {
    const randomCaptcha = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setCaptcha(randomCaptcha);
  };
  useEffect(() => {
    genereateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.captchaInput !== captcha) {
        toast.error("Captcha does not match. Please try again.");
        return;
      }
      const res = axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      toast.promise(res, {
        loading: "Logging in...",
        success: (data) => {
          router.push(data.data.route);
          return "Login successful!";
        },
        error: "Login failed. Please try again.",
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      {/* Left Panel (3 columns) */}
      <div className="col-span-12 md:col-span-4 bg-[#a12421] text-white p-8 hidden md:flex flex-col justify-center items-center">
        <img src="logo.png" alt="SB Patil College Logo" />
        <span className="text-2xl font-extralight">
          Shahajirao Patil Vikas Pratishthan's
        </span>
        <h1 className="text-4xl font-bold mt-4 text-center text-shadow-lg">
          S B Patil College of Engineering, Indapur
        </h1>
        <p className="mt-2 text-center text-lg">
          Vangali Indapur Tal:Indapur Dist:Pune - 413106 (India)
          <br />
          <span className="mt-2 text-center text-base">
            <strong>
              Approved by AICTE New Delhi, Affiliated to Savitribai Phule Pune
              University (SPPU) Pune
            </strong>
            <br />
            <strong>
              Recognised by Govt. of Maharashtra, MSBTE, DTE Mumbai. DTE Code
              06319, NAAC : A Grade, ISO 9001: 2015
            </strong>
          </span>
        </p>
      </div>

      {/* Right Panel (9 columns) */}
      <div
        className="col-span-12 md:col-span-8 flex justify-center items-center p-8"
        style={{
          backgroundImage: 'url("/bg-image.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-base-100 rounded-2xl bg-opacity-80 p-8 shadow-md w-full max-w-sm border border-t-2 border-primary text-base-content">
          <img src="/logo.png" alt="Logo" className="mb-4 lg:hidden mx-auto" />
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Login to Your Account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Email <span className="text-red-500">*</span>
              </legend>
              <input
                type="text"
                className="input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter Admin Email"
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Password
                <span className="text-red-500">*</span>
              </legend>
              <div className="join">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input join-item"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter Password"
                />
                <button
                  type="button"
                  className="btn btn-neutral join-item px-4 py-2"
                  aria-label="Toggle Password Visibility"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {!showPassword ? (
                    <IconEye size={20} />
                  ) : (
                    <IconEyeOff size={20} />
                  )}
                </button>
              </div>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Captcha</legend>
              <div className="join">
                <div className="bg-base-300 text-center px-4 py-1 text-xl font-mono tracking-widest join-item">
                  {captcha}
                </div>
                <button
                  type="button"
                  className="btn btn-neutral join-item px-4 py-2"
                  aria-label="Regenerate Captcha"
                  onClick={genereateCaptcha}
                >
                  &#x21bb;
                </button>
              </div>
              <input
                type="text"
                className="input"
                value={formData.captchaInput}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    captchaInput: e.target.value.toUpperCase(),
                  })
                }
                placeholder="Enter Captcha"
              />
            </fieldset>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember Me
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#053769] text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer disabled:opacity-50"
              disabled={
                !formData.email ||
                !formData.password ||
                formData.captchaInput !== captcha
              }
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
