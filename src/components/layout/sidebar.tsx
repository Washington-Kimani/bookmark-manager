"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {Home, Bookmark, Archive, Settings, ChevronRight, Menu, X, LogOut} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {useAuth} from "@/src/contexts/AuthContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function Sidebar() {
  const {user, logout} = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [expand, setExpand] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // handle logout function
  const handleLogout = () => {
    logout();
    router.push("/login");
  }

  React.useEffect(() => {
    // Check if mobile on mount and window resize
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const iconSize = 20;

  const navItems: NavItem[] = [
    {
      label: "All Bookmarks",
      href: "/bookmarks",
      icon: <Bookmark size={iconSize} />,
    },
    {
      label: "Archived",
      href: "/archived",
      icon: <Archive size={iconSize} />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings size={iconSize} />,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const containerVariants = {
    expanded: { width: isMobile ? "100%" : "18%", transition: { duration: 0.3 } },
    collapsed: { width: isMobile ? "100%" : "64px", transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: index * 0.1 },
    }),
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
      <>
        {/* Mobile Menu Button */}
        {isMobile && (
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-[#343940] text-white rounded-lg p-2 shadow-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        )}

        <AnimatePresence mode="wait">
          <motion.aside
              variants={containerVariants}
              initial={expand ? "expanded" : "collapsed"}
              animate={expand ? "expanded" : "collapsed"}
              exit="collapsed"
              className={`${
                  isMobile
                      ? `fixed top-0 left-0 z-40 h-screen transition-all w-full ${
                          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                      }`
                      : "relative h-[95vh] ml-3 my-auto"
              } flex flex-col bg-[#343940] text-white border-gray-200 overflow-y-auto overflow-x-hidden rounded-none md:rounded-xl transition-all`}
          >
            {/* Main Navigation */}
            <nav className="flex-1 w-full item-center px-4 py-6 space-y-2">
              <div className="flex-shrink-0 flex items-center mb-6">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    className={`w-full flex items-center ${isMobile ? "justify-center":"justify-start"} gap-3 text-xl md:text-2xl font-bold text-white`}
                >
                  <Image
                      width={40}
                      height={40}
                      src="https://img.icons8.com/clouds/100/bookmark--v2.png"
                      alt="Site"
                      className="w-8 h-8 md:w-10 md:h-10"
                  />
                  {expand && <span className="truncate">Bookmark Manager</span>}
                </motion.h1>
              </div>

              <div className="mb-6">
                {navItems.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                    >
                      <Link
                          href={item.href}
                          onClick={handleNavClick}
                          className={`flex ${
                              expand ? "justify-between" : "justify-center"
                          } px-3 py-2 mt-3 rounded-lg transition whitespace-nowrap ${
                              isActive(item.href)
                                  ? "bg-[#294D61] text-white font-semibold"
                                  : "text-white hover:text-black hover:bg-[#6DA5C0]"
                          }`}
                      >
                        <div className="flex items-center justify-center space-x-3 min-w-0">
                          <span>
                            {item.icon}
                          </span>
                          {expand && (
                              <span className="truncate text-sm md:text-base">{item.label}</span>
                          )}
                        </div>
                        {isActive(item.href) && expand && <ChevronRight size={18} />}
                      </Link>
                    </motion.div>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="w-full flex flex-col gap-4 p-4 bg-[#869fe6] rounded-md">
              <div className="w-full flex items-center justify-around">
                <span className={`text-black text-sm ${expand ? "": "hidden"}`}>
                  {expand && user?.username.charAt(0).toUpperCase().concat(user?.username.slice(1))}
                </span>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-around px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  <LogOut size={18} />
                  {expand && (<span className={"ml-2"}>Logout</span>)}
                </button>
              </div>
              <p className="text-xs text-white text-center">
                {expand ? "Bookmark Manager v1.0" : "v1.0"}
              </p>
            </div>

            {/* Toggle Button - Desktop Only */}
            {!isMobile && (
                <button
                    className="absolute bottom-6 left-2.5 bg-[#343940] text-white rounded-full p-2 shadow-lg"
                    onClick={() => setExpand(!expand)}
                >
                  <ChevronRight
                      size={20}
                      className={`transition-transform ${expand ? "rotate-0" : "rotate-180"}`}
                  />
                </button>
            )}
          </motion.aside>
        </AnimatePresence>

        {/* Mobile Overlay */}
        {isMobile && isMobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            />
        )}
      </>
  );
}