"use client";
import { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import SectionTitle from "@/components/SectionTitle";
import { IconUsers, IconCheck, IconX, IconClock } from "@tabler/icons-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    attendancePercentage: 0,
  });
  const [todayList, setTodayList] = useState<any[]>([]);

  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    fetchData();
    // Auto-refresh data every 5 seconds for "live" feel
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await api.get(endpoints.attendance.stats);
      setStats(statsRes.data);

      const todayRes = await api.get(endpoints.attendance.today);
      setTodayList(todayRes.data);
      setBackendError(false);
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      // Check if it is a network error
      setBackendError(true);
    }
  };

  if (backendError) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="text-red-500 bg-red-100 p-4 rounded-full">
          <IconX size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Backend is Offline</h2>
        <p className="text-gray-600 max-w-md">
          Cannot connect to the Vidya Rakshak Server. Please ensure <code>start_backend.bat</code> is running in the terminal.
        </p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Retry Connection
        </button>
      </div>
    )
  }

  const statCards = [
    { title: "Total Students", value: stats?.totalStudents || 0, icon: IconUsers, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Present Today", value: stats?.presentToday || 0, icon: IconCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Absent", value: stats?.absentToday || 0, icon: IconX, color: "text-rose-600", bg: "bg-rose-100" },
    { title: "Daily Avg %", value: (stats?.attendancePercentage || 0) + "%", icon: IconClock, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  // Dummy chart data for demo (backend doesn't fully support historical yet)
  const chartData = [
    { day: "Mon", attendance: 85 },
    { day: "Tue", attendance: 88 },
    { day: "Wed", attendance: 92 },
    { day: "Thu", attendance: 90 },
    { day: "Fri", attendance: stats.attendancePercentage || 85 },
  ];

  return (
    <div className="p-6 space-y-8 bg-base-100/50 min-h-full">
      <SectionTitle title="Dashboard Overview" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="card bg-white shadow-sm hover:shadow-md transition-all border border-base-200">
            <div className="card-body flex flex-row items-center gap-4 p-6">
              <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 card bg-white shadow-sm border border-base-200">
          <div className="card-body">
            <h3 className="card-title text-gray-700 mb-6">Weekly Trends</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ fill: '#0d9488', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Feed / Recent List */}
        <div className="card bg-white shadow-sm border border-base-200">
          <div className="card-body">
            <h3 className="card-title text-gray-700 mb-4">Recent Arrivals</h3>
            <div className="overflow-y-auto max-h-[300px] space-y-3">
              {todayList.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No attendance marked yet today.</p>
              ) : (
                todayList.slice().reverse().map((record: any, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="avatar placeholder">
                      <div className="bg-teal-700 text-white rounded-full w-10">
                        <span className="text-xs">{record.studentName.substring(0, 2).toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{record.studentName}</p>
                      <p className="text-xs text-gray-500">{record.time}</p>
                    </div>
                    <div className="ml-auto badge badge-success badge-sm badge-outline">Present</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
