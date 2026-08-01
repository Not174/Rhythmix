"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MiniPlayer from "@/components/MiniPlayer";
import { useTheme } from "@/context/ThemeContext";
import { useAudio } from "@/context/AudioContext";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { currentSong } = useAudio();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPlayerPage = pathname.startsWith("/player/");

  return (
    <div
      className={`
        ${isPlayerPage ? "h-screen overflow-hidden" : "min-h-screen"}
        transition-colors duration-300
        ${
          theme === "dark"
            ? "bg-dark-900 text-white"
            : "bg-gradient-to-br from-white to-sky-100 text-gray-900"
        }
      `}
    >
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset by sidebar on md+ */}
      <div className={`md:ml-60 flex flex-col ${isPlayerPage ? "h-screen overflow-hidden" : "min-h-screen"}`}>
        {!isPlayerPage && (
          <Header onMenuClick={() => setSidebarOpen(true)} />
        )}
        <main
          className={`flex-1 ${isPlayerPage ? "overflow-hidden" : ""} ${
            currentSong && !isPlayerPage ? "pb-24" : !isPlayerPage ? "pb-8" : ""
          }`}
        >
          {children}
        </main>
      </div>

      {!isPlayerPage && <MiniPlayer />}
    </div>
  );
}
