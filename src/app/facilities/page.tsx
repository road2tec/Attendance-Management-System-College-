import { IconBook, IconBus, IconWifi, IconBed, IconFirstAidKit, IconBallFootball } from "@tabler/icons-react";

const facilities = [
    {
        title: "Central Library",
        icon: IconBook,
        desc: "A vast collection of 50,000+ books, journals, e-resources and a digital library section with internet access."
    },
    {
        title: "Transport",
        icon: IconBus,
        desc: "Fleet of buses covering Vadgaon, Dhayari, Katraj and surrounding areas in Pune for easy commute."
    },
    {
        title: "Sports Complex",
        icon: IconBallFootball,
        desc: "Cricket ground, Football, Volleyball courts, plus indoor games like Table Tennis, Chess, and a fully equipped Gymnasium."
    },
    {
        title: "Wi-Fi Campus",
        icon: IconWifi,
        desc: "100% Wi-Fi enabled campus with high-speed internet access in classrooms, labs, library and hostel areas."
    },
    {
        title: "Hostel",
        icon: IconBed,
        desc: "Girls hostel with 24/7 security, hot & cold water, purified drinking water, mess, and recreational facilities."
    },
    {
        title: "Health Care",
        icon: IconFirstAidKit,
        desc: "On-campus medical facility with visiting doctors, first-aid and emergency health support for students."
    }
];

export default function FacilitiesPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <div className="bg-[#8B1A1A] text-white py-16 px-6 text-center">
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
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#8B1A1A] shrink-0 shadow-sm">
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
