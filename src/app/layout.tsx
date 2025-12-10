import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {AuthProvider} from "@/src/contexts/AuthContext";
import {Toaster} from "sonner";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookmarks Manager",
  description: "Handle all your bookmarks in a modern way",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#132E35] relative`}>
      <AuthProvider>
        <Toaster position={"top-center"} richColors/>
        {children}
      </AuthProvider>
      </body>
      </html>
  );
}
