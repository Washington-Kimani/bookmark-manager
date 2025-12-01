"use client";

import React from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {BookmarkIcon, LogOut, Menu} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="mx-auto  sm:px-6 lg:px-8">
          <div className="flex px-4 justify-between items-center h-16">
            {/* logo */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="flex items-center gap-3 text-2xl font-bold text-[#056760]">
                <span className={"flex items-center justify-center w-8 h-8 rounded-full bg-[#056760]"}>
                  <BookmarkIcon className={"text-white"} />
                </span>
                <span>Bookmark Manager</span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
            <span className="text-gray-600 text-sm">
              Welcome, <span className="font-semibold">{user?.username.charAt(0).toUpperCase().concat(user?.username.slice(1)) || user?.email}</span>
            </span>
              <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>

            {/* mobile menu*/}
            <div className="md:hidden">
              <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
              <div className="md:hidden pb-4 space-y-2">
                <div className="text-gray-600 text-sm px-4 py-2">
                  Welcome, <span className="font-semibold">{user?.username.charAt(0).toUpperCase().concat(user?.username.slice(1)) || user?.email}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
          )}
        </div>
      </nav>
  );
}