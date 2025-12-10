"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Image from "next/image";
import { DoorOpen } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const {isAuthenticated} = useAuth();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/bookmarks");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative bg-[rgba(0,0,0,0.5)]">
      <section className="w-11/12 lg:w-3/5 h-3/4 flex flex-col lg:flex-row bg-white rounded-xl shadow-xl shadow-cyan-500/50 overflow-hidden">
        {/* Image */}
        <div className="w-full lg:w-1/2 h-full relative">
          <Image
            src="/bg_1.jpg"
            alt="Bookmark Image"
            width={800}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="lg:w-1/2 w-full h-full flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-4">
            Welcome to Your New Favorite Bookmark Manager!
          </h1>
          <p className="text-lg text-center text-gray-700 mb-6">
            Organize and manage your bookmarks with ease. Start now and save
            time browsing!
          </p>
          <button
            onClick={() => handleClick()}
            className="w-full lg:w-2/3 rounded-md flex items-center justify-center bg-[#056760] py-2 px-6 gap-x-3 text-white font-semibold transition-transform transform hover:scale-105"
          >
            <DoorOpen className="text-white" />
            <span>Start for Free</span>
          </button>
        </div>
      </section>
    </div>
  );
}
