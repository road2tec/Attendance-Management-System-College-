"use client";
import { Admin } from "@/Types";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface UserContextType {
  user: Admin | null;
  setUser: (user: Admin | null) => void;
  login: (userData: Admin) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<UserContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage on initial load
    const stored = localStorage.getItem("vidya_admin_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse user data");
        localStorage.removeItem("vidya_admin_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: Admin) => {
    console.log("LOGIN CALLED WITH USER:", userData); // One-time Debug Log
    setUser(userData);
    localStorage.setItem("vidya_admin_user", JSON.stringify(userData));

    // Normalize role check (case-insensitive just in case)
    const role = (userData.role || "").toLowerCase();

    if (role === 'student') {
      console.log("Redirecting to STUDENT dashboard");
      window.location.href = "/student/dashboard";
    } else {
      console.log("Redirecting to ADMIN dashboard");
      window.location.href = "/admin/dashboard";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vidya_admin_user");
    router.push("/login?redirect=false"); // Prevent auto-redirect loop
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
