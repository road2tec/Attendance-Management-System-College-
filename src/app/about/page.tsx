export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* Header / Hero */}
            <div className="bg-[#9d2222] text-white py-16 px-6 text-center">
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
                        <h2 className="text-2xl font-bold text-[#9d2222] mb-4">Our Legacy</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            S.B. Patil College of Engineering was established in 2009 by the Shahajirao Patil Vikas Pratishthan.
                            Located in the lush green campus of Indapur, we are committed to producing high-quality engineers who can compete globally.
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
                        <p className="text-gray-600 italic">
                            "To serve the society, industry and all stakeholders through value-added quality education and create competent and professional engineers."
                        </p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#9d2222] shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>To provide state-of-the-art infrastructure and facilities.</li>
                            <li>To promote research and innovation among students.</li>
                            <li>To inculcate ethical values and leadership qualities.</li>
                        </ul>
                    </div>
                </section>

                {/* Principal's Desk */}
                <section className="bg-[#9d2222] text-white p-10 rounded-2xl shadow-xl">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white shrink-0 overflow-hidden">
                            <img src="/principal_real.jpg" alt="Principal Dr. Pravin Nemade" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">From the Principal's Desk</h3>
                            <p className="opacity-90 leading-relaxed italic mb-4">
                                "We believe in holistic development. Education is not just about syllabus, but about building character and capability. S.B. Patil College provides the perfect ecosystem for this growth."
                            </p>
                            <p className="font-bold text-yellow-300">– Dr. Pravin Nemade</p>
                            <p className="text-xs opacity-70">Principal, SBPCOE</p>
                        </div>
                    </div>
                </section>

                {/* Campus Gallery Section */}
                <section className="py-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Campus Gallery</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                            { url: "https://images.shiksha.com/mediadata/images/1545041008phpmP3O6v.jpeg", title: "College Campus" },
                            { url: "https://images.shiksha.com/mediadata/images/1545041001phph93B3V.jpeg", title: "Main Building" },
                            { url: "https://images.shiksha.com/mediadata/images/1545041003phpzHREjA.jpeg", title: "Classrooms" },
                            { url: "https://images.shiksha.com/mediadata/images/1545041005phppWqclt.jpeg", title: "Labs" },
                            { url: "https://images.shiksha.com/mediadata/images/1544158428phpIu1mSu.jpeg", title: "Entrance" },
                            { url: "https://images.shiksha.com/mediadata/images/1544158431phptJtX84.jpeg", title: "Activity Center" }
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

            </div>
        </div>
    );
}
