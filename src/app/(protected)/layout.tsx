"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/navbar";
import Sidebar from "@/src/components/layout/sidebar";
import Loading from "@/src/components/layout/loading";

export default function ProtectedLayout({
                                          children,
                                        }: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth context has finished loading
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // show loading spinner while checking auth state
  if (isLoading) {
    return <Loading />
  }

  // If not authenticated after loading, don't render the layout
  if (!isAuthenticated) {
    return null;
  }

  return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
  );
}