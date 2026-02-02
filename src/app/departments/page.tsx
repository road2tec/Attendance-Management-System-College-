import { IconCpu, IconBuildingBridge, IconSettings, IconDeviceDesktop, IconAntennaBars5 } from "@tabler/icons-react";

const departments = [
    {
        name: "Computer Engineering",
        icon: IconDeviceDesktop,
        desc: "Focusing on software development, AI, and modern computing technologies.",
        intake: 60
    },
    {
        name: "Civil Engineering",
        icon: IconBuildingBridge,
        desc: "Building the infrastructure of tomorrow with sustainable construction practices.",
        intake: 60
    },
    {
        name: "Mechanical Engineering",
        icon: IconSettings,
        desc: "The backbone of industry, covering robotics, thermodynamics, and manufacturing.",
        intake: 60
    },
    {
        name: "E & TC Engineering",
        icon: IconAntennaBars5,
        desc: "Electronics and Telecommunication connecting the world through signals.",
        intake: 60
    },
    {
        name: "Electrical Engineering",
        icon: IconCpu,
        desc: "Powering innovations and sustainable energy solutions.",
        intake: 60
    }
];

export default function DepartmentsPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <div className="bg-[#9d2222] text-white py-16 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4 uppercase tracking-wide">Our Departments</h1>
                <p className="opacity-80 max-w-2xl mx-auto">
                    Offering diverse engineering disciplines to shape the future.
                </p>
                <a href="/" className="mt-8 inline-block text-sm font-semibold hover:text-yellow-300 transition-colors">← Back to Home</a>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {departments.map((dept, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-[#9d2222] shadow-sm mb-6">
                                <dept.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{dept.name}</h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                {dept.desc}
                            </p>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                                <span>Intake: {dept.intake}</span>
                                <span className="text-[#9d2222] cursor-pointer hover:underline">View Syllabus</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
