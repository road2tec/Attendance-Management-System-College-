"use client";
import Link from "next/link";
import { IconLogin, IconUserScan, IconChevronRight, IconPhone, IconMail, IconMapPin, IconNews, IconTrophy, IconUsers, IconBriefcase, IconCertificate, IconQuote, IconActivity } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export default function Home() {
    // Scroll state for navbar
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // College Statistics
    const stats = [
        { label: "Years of Excellence", value: "15+", icon: IconCertificate },
        { label: "Students Enrolled", value: "3000+", icon: IconUsers },
        { label: "Qualified Faculty", value: "200+", icon: IconTrophy },
        { label: "Top Recruiters", value: "150+", icon: IconBriefcase },
    ];

    // News Items
    const news = [
        "Admissions Open for Academic Year 2026-27 | Apply Now",
        "Congratulations to our Final Year students for 100% Placment in TCS & Infosys",
        "Vidya Rakshak: AI-Powered Smart Campus System Launched Successfully",
        "Upcoming Event: National Level Hackathon 'Techno-Vision' on March 15th",
    ];

    return (
        <main className="min-h-screen font-sans text-gray-800 bg-white">

            {/* Top Bar (Contact Info) */}
            <div className="bg-[#9d2222] text-white py-2 px-6 text-sm flex flex-col md:flex-row justify-between items-center z-50 relative">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1 hover:text-yellow-300 transition-colors cursor-pointer">
                        <IconPhone size={14} /> +91-2111-225600
                    </span>
                    <span className="flex items-center gap-1 hover:text-yellow-300 transition-colors cursor-pointer">
                        <IconMail size={14} /> principal@sbpcoe.com
                    </span>
                </div>
                <div className="flex gap-4 mt-2 md:mt-0 opacity-80 text-xs uppercase tracking-wide">
                    <span>DTE Code: 6319</span>
                    <span>|</span>
                    <span>NAAC 'A' Grade</span>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className={`sticky top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#9d2222] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                            SB
                        </div>
                        <div className="leading-tight">
                            <h1 className="text-xl font-bold text-[#9d2222] uppercase tracking-tight">S.B. Patil College</h1>
                            <p className="text-xs text-gray-500 font-medium tracking-widest">OF ENGINEERING, INDAPUR</p>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
                        <Link href="/" className="hover:text-[#9d2222] transition-colors relative group">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9d2222] transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/about" className="hover:text-[#9d2222] transition-colors relative group">
                            About Us
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9d2222] transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/departments" className="hover:text-[#9d2222] transition-colors relative group">
                            Departments
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9d2222] transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/placements" className="hover:text-[#9d2222] transition-colors relative group">
                            Placements
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9d2222] transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/facilities" className="hover:text-[#9d2222] transition-colors relative group">
                            Facilities
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9d2222] transition-all group-hover:w-full"></span>
                        </Link>

                        {/* Login Button */}
                        <Link href="/login" className="flex items-center gap-2 bg-[#9d2222] text-white px-5 py-2.5 rounded-full hover:bg-[#801b1b] transition-all transform hover:-translate-y-0.5 shadow-md shadow-red-900/10">
                            <IconLogin size={18} />
                            <span>Admin Login</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* News Ticker */}
            <div className="bg-gray-900 text-white text-xs py-2 overflow-hidden flex items-center shadow-inner relative z-30">
                <div className="bg-[#9d2222] px-4 py-2 font-bold uppercase tracking-wider absolute left-0 z-10 flex items-center gap-2 h-full shadow-lg">
                    <IconNews size={14} /> Latest News
                </div>
                <div className="whitespace-nowrap animate-marquee flex gap-12 pl-40">
                    {news.map((item, index) => (
                        <span key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span> {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative h-[650px] w-full bg-gray-900 flex items-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <div
                        className="w-full h-full bg-cover bg-center animate-pan-slow"
                        style={{ backgroundImage: "url('/campus_bg.png')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white pt-10">
                    <div className="inline-block px-3 py-1 bg-yellow-400 text-black font-bold text-xs rounded-full mb-6 uppercase tracking-wider animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        ISO 9001:2015 Certified Institute
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        Excellence in <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Engineering Education</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-xl mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        Transforming students into industry-ready professionals through innovation, research, and holistic development at S.B. Patil College of Engineering.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                        <a href="#vidya-rakshak" className="px-8 py-4 bg-[#9d2222] text-white rounded-lg font-bold hover:bg-[#801b1b] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-red-900/50">
                            Smart Campus <IconChevronRight size={18} />
                        </a>
                        <a href="/about" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-lg font-bold hover:bg-white/20 transition-colors flex items-center justify-center">
                            Virtual Tour
                        </a>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <section className="bg-white py-12 -mt-16 relative z-20 container max-w-6xl mx-auto px-6 rounded-xl shadow-2xl border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className="w-12 h-12 bg-red-50 text-[#9d2222] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <stat.icon size={24} />
                            </div>
                            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Vidya Rakshak Section (The Project Integration) */}
            <section id="vidya-rakshak" className="py-16 bg-gray-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Campus Digital Services</h2>
                        <div className="w-16 h-1 bg-[#9d2222] mx-auto rounded-full"></div>
                    </div>

                    <div className="flex justify-center gap-10 max-w-5xl mx-auto flex-wrap">

                        {/* Student Kiosk Card */}
                        <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-teal-500 w-full md:w-96">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
                                    <IconUserScan size={28} />
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">System Active</span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Attendance</h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                AI-powered contactless entry for students. Mark your daily attendance instantly via the digital kiosk.
                            </p>

                            <Link
                                href="/student/attendance"
                                className="inline-flex items-center text-teal-600 font-bold hover:gap-2 transition-all text-sm"
                            >
                                Access Kiosk <IconChevronRight size={16} />
                            </Link>
                        </div>

                        {/* Academics Card */}
                        <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 w-full md:w-96">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                    <IconCertificate size={28} />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">Academic Calendar</h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                View the schedule for exams, holidays, and upcoming events for the current academic year.
                            </p>

                            <a href="#" className="inline-flex items-center text-blue-600 font-bold hover:gap-2 transition-all text-sm">
                                View Schedule <IconChevronRight size={16} />
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            {/* Principal Message Section */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Principal Message</h2>
                        <p className="text-gray-500 text-sm mt-2">Home ◦ Principal Message</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 items-start">
                        {/* Principal Image Placeholder - Since we don't have a direct URL, using a professional avatar or placeholder */}
                        <div className="md:w-1/3 w-full">
                            <div className="bg-gray-100 rounded-lg p-2 border border-gray-200">
                                <div className="aspect-[3/4] bg-gray-200 w-full relative overflow-hidden flex items-end justify-center">
                                    <img src="/principal_real.jpg" alt="Principal Dr. Pravin Nemade" className="w-full h-full object-cover object-top" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-gray-800">Dr. Pravin Nemade</h3>
                                <p className="text-[#9d2222] font-semibold">Principal</p>
                                <div className="flex gap-2 mt-2">
                                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">f</div>
                                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">in</div>
                                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">x</div>
                                </div>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="md:w-2/3 text-gray-600 leading-relaxed text-lg space-y-6 text-justify">
                            <p className="font-semibold text-gray-800">Dear Stakeholders, <br /> Greetings!</p>
                            <p>
                                It is with great pride and a deep sense of responsibility that I extend my heartfelt welcome to all our valued stakeholders — students, parents, faculty, alumni, industry partners, and well-wishers — who form the backbone of S. B. Patil College of Engineering.
                            </p>
                            <p>
                                At SBPCOE, we are committed to creating an environment that nurtures academic excellence, innovation, ethical values, and holistic development. Our mission is to empower students with strong technical knowledge, problem-solving skills, and leadership qualities that will enable them to contribute meaningfully to society and the nation.
                            </p>
                            <p>
                                We believe that education is a collaborative journey. The trust and support of our stakeholders inspire us to continuously evolve, adopt the best educational practices, strengthen our research initiatives, and build strong industry-academia linkages. Together, we work towards shaping not just engineers, but responsible citizens and future leaders who will drive global progress.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 border-t-4 border-yellow-500">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-2xl font-bold mb-6">S.B. Patil College of Engineering</h4>
                        <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                            Established with a vision to provide world-class technical education. We strive to create future leaders who contribute to society through innovation.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Placeholder */}
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#9d2222] transition-colors cursor-pointer">FB</div>
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#9d2222] transition-colors cursor-pointer">TW</div>
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#9d2222] transition-colors cursor-pointer">LI</div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-yellow-500">Quick Links</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Admission</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Campus Life</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-yellow-500">Contact Info</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex gap-3">
                                <IconMapPin className="shrink-0 text-[#9d2222]" />
                                Vangali, Indapur, Dist: Pune - 413106
                            </li>
                            <li className="flex gap-3">
                                <IconPhone className="shrink-0 text-[#9d2222]" />
                                +91-2111-225600
                            </li>
                            <li className="flex gap-3">
                                <IconMail className="shrink-0 text-[#9d2222]" />
                                principal@sbpcoe.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2026 S.B. Patil College of Engineering. All Rights Reserved.</p>
                    <p>Vidya Rakshak System by <span className="text-white">Smart Coders</span></p>
                </div>
            </footer>
        </main>
    );
}
