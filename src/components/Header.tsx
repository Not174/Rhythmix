"use client";

import React from "react";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { theme } = useTheme();

  return (
    <header
      className={`
        sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-4
        transition-colors duration-300 border-b
        ${
          theme === "dark"
            ? "bg-dark-900/80 border-white/5"
            : "bg-white/70 border-gray-200"
        }
      `}
      style={{ backdropFilter: "blur(20px)" }}
    >
      {/* Left: Page title area (flex spacer) */}
      <div className="flex-shrink-0 w-8" />

      {/* Center: Search bar */}
      <SearchBar />

      {/* Right: Theme toggle */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
