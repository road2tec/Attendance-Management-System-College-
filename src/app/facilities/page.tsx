import { IconBook, IconBus, IconWifi, IconBed, IconFirstAidKit } from "@tabler/icons-react";

const facilities = [
    {
        title: "Central Library",
        icon: IconBook,
        desc: "A vast collection of 25,000+ books, international journals, and a digital e-library section."
    },
    {
        title: "Transport",
        icon: IconBus,
        desc: "Fleet of 15+ buses covering Indapur, Baramati, and surrounding rural areas for easy commute."
    },
    {
        title: "Wi-Fi Campus",
        icon: IconWifi,
        desc: "High-speed 100 Mbps internet connectivity across the entire campus and hostels."
    },
    {
        title: "Hostel",
        icon: IconBed,
        desc: "Separate boys and girls hostels with 24/7 security, mess, and recreational facilities."
    },
    {
        title: "Health Care",
        icon: IconFirstAidKit,
        desc: "On-campus medical facility with visiting doctors for emergency health support."
    }
];

export default function FacilitiesPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <div className="bg-[#9d2222] text-white py-16 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4 uppercase tracking-wide">Campus Facilities</h1>
                <p className="opacity-80 max-w-2xl mx-auto">
                    World-class infrastructure for a holistic learning experience.
                </p>
                <a href="/" className="mt-8 inline-block text-sm font-semibold hover:text-yellow-300 transition-colors">← Back to Home</a>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-10">
                    {facilities.map((fac, idx) => (
                        <div key={idx} className="flex gap-6 items-start p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#9d2222] shrink-0 shadow-sm">
                                <fac.icon size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{fac.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {fac.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
