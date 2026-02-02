export default function PlacementsPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <div className="bg-[#9d2222] text-white py-16 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4 uppercase tracking-wide">Training & Placement</h1>
                <p className="opacity-80 max-w-2xl mx-auto">
                    Bridging the gap between Campus and Corporate.
                </p>
                <a href="/" className="mt-8 inline-block text-sm font-semibold hover:text-yellow-300 transition-colors">← Back to Home</a>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-4xl font-bold text-[#9d2222] mb-1">200+</div>
                        <div className="text-xs uppercase font-bold text-gray-400">Companies Visited</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-4xl font-bold text-teal-600 mb-1">85%</div>
                        <div className="text-xs uppercase font-bold text-gray-400">Placement Ratio</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-1">12 LPA</div>
                        <div className="text-xs uppercase font-bold text-gray-400">Highest Package</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="text-4xl font-bold text-orange-500 mb-1">500+</div>
                        <div className="text-xs uppercase font-bold text-gray-400">Students Placed</div>
                    </div>
                </div>

                {/* Recruiters Grid */}
                <div>
                    <h3 className="text-2xl font-bold text-center mb-8">Our Top Recruiters</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                        {/* Placeholders for logos */}
                        {["TCS", "Infosys", "Wipro", "Capgemini", "Cognizant", "Accenture", "IBM", "Persistent", "Zensar", "L&T", "Bosch", "Amazon"].map((company, i) => (
                            <div key={i} className="bg-white h-24 flex items-center justify-center rounded-lg shadow-sm border border-gray-100 font-bold text-gray-400">
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
