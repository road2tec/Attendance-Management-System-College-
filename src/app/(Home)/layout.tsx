"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "../globals.css";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>VidyaRakshak | S B Patil College of Engineering, Indapur</title>
        <meta
          name="description"
          content="VidyaRakshak is a real-time smart campus surveillance and guidance system that uses AI and computer vision to track student movements, prevent class bunking, and ensure campus-wide security. It offers voice-guided directions and alert systems for enhanced campus management."
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        data-theme="light"
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
