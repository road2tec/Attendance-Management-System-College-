import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Vidya Rakshak - Smart Attendance",
    description: "AI Powered Campus Security & Attendance System",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="light">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
