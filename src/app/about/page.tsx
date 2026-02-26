export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* Header / Hero */}
            <div className="bg-[#8B1A1A] text-white py-16 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4 uppercase tracking-wide">About Us</h1>
                <p className="opacity-80 max-w-2xl mx-auto">
                    Dedicated to excellence in technical education since 2009.
                </p>
                <a href="/" className="mt-8 inline-block text-sm font-semibold hover:text-yellow-300 transition-colors">← Back to Home</a>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">

                {/* Introduction */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#8B1A1A] mb-4">Our Legacy</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Sinhgad College Of Engineering (SCOE) was established in 1996 by the Sinhgad Technical Education Society (STES).
                            Located in the rapidly developing area of Vadgaon (Bk), Pune, we are committed to producing high-quality engineers and managers who can compete globally.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Our institute is approved by AICTE, New Delhi, recognized by the Government of Maharashtra, and affiliated with Savitribai Phule Pune University (SPPU).
                            We hold an impressive <span className="font-bold text-gray-800">NAAC 'A+' Grade</span> accreditation.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden relative border border-gray-200">
                        <IconActivity size={64} className="opacity-20" />
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-yellow-500 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Our Vision</h3>
                        <p className="text-gray-600">
                            "We are committed to produce not only good engineers but good human beings, also."
                        </p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#8B1A1A] shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Holistic development of students and teachers.</li>
                            <li>Imbibing a unique value system and transparent work culture.</li>
                            <li>Generating, preserving and sharing knowledge for a vibrant society.</li>
                        </ul>
                    </div>
                </section>

                {/* Principal's Desk */}
                <section className="bg-[#8B1A1A] text-white p-10 rounded-2xl shadow-xl">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white shrink-0 overflow-hidden flex items-center justify-center">
                            <IconUsers size={48} className="text-white opacity-50" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">From the Director's Desk</h3>
                            <p className="opacity-90 leading-relaxed mb-4">
                                "Holistic development of students and teachers in what we believe in and work for. We strive to achieve this by imbibing a unique value system and transparent work culture."
                            </p>
                            <p className="font-bold text-yellow-300">– Dr. S. D. Lokhande</p>
                            <p className="text-xs opacity-70">Principal, SCOE</p>
                        </div>
                    </div>
                </section>

                {/* Campus Features Section */}
                <section className="py-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Academic Excellence</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                            { title: "Modern Laboratories", desc: "State-of-the-art labs for all engineering departments." },
                            { title: "Research Center", desc: "Dedicated spaces for innovation and development." },
                            { title: "Library", desc: "Extensive collection of digital and physical resources." },
                            { title: "Sports Complex", desc: "Facilities for overall physical development." },
                            { title: "Cultural Hub", desc: "Platforms for extracurricular talent." },
                            { title: "Placement Cell", desc: "Excellent track record with top recruiters." }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-[#8B1A1A] mb-2">{feature.title}</h4>
                                <p className="text-sm text-gray-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Google Map Section */}
                <section className="py-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Locate Us</h2>
                    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.442!2d73.834!3d18.459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eab!2sSinhgad%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1625642642234!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy">
                        </iframe>
                    </div>
                </section>
            </div>
        </div>
    );
}
