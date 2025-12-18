"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/layout/sidebar";

export default function ProtectedLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth context has finished loading
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // If not authenticated after loading, don't render the layout
  if (!isAuthenticated) {
    return null;
  }

  return (
      <div className="flex flex-col overflow-y-hidden max-h-screen">
        {/*<Navbar />*/}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
  );
}