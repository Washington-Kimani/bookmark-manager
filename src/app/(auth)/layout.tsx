"use client";

import React from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout(
    {
        children,
    }: {
        children: React.ReactNode;
    }
) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // user is already authenticated, redirect to bookmarks
    if (isAuthenticated) {
      router.push("/bookmarks");
    }
  }, [isAuthenticated, router]);

  return (
      <div className="min-h-screen bg-gradient-to-br">
        {children}
      </div>
  );
}