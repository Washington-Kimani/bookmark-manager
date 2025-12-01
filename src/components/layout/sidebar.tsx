"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bookmark,
  Archive,
  Settings,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function Sidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/bookmarks",
      icon: <Home size={20} />,
    },
    {
      label: "All Bookmarks",
      href: "/bookmarks",
      icon: <Bookmark size={20} />,
    },
    {
      label: "Archived",
      href: "/archived",
      icon: <Archive size={20} />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings size={20} />,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 overflow-y-auto">
        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="mb-6">
            {navItems.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition ${
                        isActive(item.href)
                            ? "bg-blue-50 text-[#056760] font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive(item.href) && <ChevronRight size={18} />}
                </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Bookmark Manager v1.0
          </p>
        </div>
      </aside>
  );
}