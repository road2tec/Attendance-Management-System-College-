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
                            Located in the rapidly developing area of Narhe, Pune, we are committed to producing high-quality engineers and managers who can compete globally.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Our institute is approved by AICTE, New Delhi, recognized by the Government of Maharashtra, and affiliated with Savitribai Phule Pune University (SPPU).
                            We hold an impressive <span className="font-bold text-gray-800">NAAC 'A' Grade</span> accreditation.
                        </p>
                    </div>
                    <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden relative">
                        <img
                            src="/campus_inner.jpg"
                            alt="College Building"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-yellow-500 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Our Vision</h3>
                        <p className="text-gray-600">
                            "To serve the society, industry and all stakeholders through value-added quality education and create competent and professional engineers."
                        </p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#8B1A1A] shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>To provide state-of-the-art infrastructure and facilities.</li>
                            <li>To promote research and innovation among students.</li>
                            <li>To inculcate ethical values and leadership qualities.</li>
                        </ul>
                    </div>
                </section>

                {/* Principal's Desk */}
                <section className="bg-[#8B1A1A] text-white p-10 rounded-2xl shadow-xl">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white shrink-0 overflow-hidden">
                            <img src="/principal_real.jpg" alt="Director Prof. Dr. T. J. Sawant" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">From the Director's Desk</h3>
                            <p className="opacity-90 leading-relaxed mb-4">
                                "We believe in holistic development. Education is not just about syllabus, but about building character and capability. Sinhgad College Of Engineering provides the perfect ecosystem for this growth."
                            </p>
                            <p className="font-bold text-yellow-300">– Prof. Dr. T. J. Sawant</p>
                            <p className="text-xs opacity-70">Principal, SCOE</p>
                        </div>
                    </div>
                </section>

                {/* Campus Gallery Section */}
                <section className="py-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Campus Gallery & Sports</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                            { url: "/gallery/scoe_campus_1.jpg", title: "Main Campus Building" },
                            { url: "/gallery/scoe_campus_2.jpg", title: "SCOE Infrastructure" },
                            { url: "/gallery/scoe_campus_3.jpg", title: "College View" },
                            { url: "/gallery/sports_1.jpg", title: "Sports Event" },
                            { url: "/gallery/sports_2.jpg", title: "Cultural Gathering" },
                            { url: "/gallery/sports_3.jpg", title: "MESA Event" }
                        ].map((img, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-xl shadow-md h-64 bg-gray-100">
                                <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <p className="text-white font-semibold text-lg">{img.title}</p>
                                </div>
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
