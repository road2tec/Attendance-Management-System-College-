"use client";
import { IconLayoutDashboard, IconUsers, IconLogout, IconShield, IconScan } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Sidebar Link Component
const SidebarLink = ({ href, icon: Icon, label }: any) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
        ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
        : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
        }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

// Inner component that handles logic requiring AuthContext
function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm hidden md:flex md:flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
            <IconShield size={18} />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-emerald-600">
            Vidya Rakshak
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink href="/admin/dashboard" icon={IconLayoutDashboard} label="Dashboard" />
          <SidebarLink href="/admin/manage-students" icon={IconUsers} label="Students" />
          <SidebarLink href="/live-check" icon={IconScan} label="Live Check" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <IconLogout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b flex items-center px-4 justify-between sticky top-0 z-40">
          <span className="font-bold text-teal-700">Vidya Rakshak Admin</span>
          <button onClick={logout} className="p-2 text-red-500"><IconLogout /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// Nested Layout (Inherits from Root Layout)
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
