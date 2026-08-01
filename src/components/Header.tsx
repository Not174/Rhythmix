"use client";

import React from "react";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import { useTheme } from "@/context/ThemeContext";

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <header
      className={`
        sticky top-0 z-30 flex items-center justify-between gap-4 px-4 py-4
        transition-colors duration-300 border-b
        ${
          theme === "dark"
            ? "bg-dark-900/80 border-white/5"
            : "bg-white/70 border-gray-200"
        }
      `}
      style={{ backdropFilter: "blur(20px)" }}
    >
      {/* Hamburger menu — visible only on mobile */}
      <button
        onClick={onMenuClick}
        className={`md:hidden p-2 rounded-xl transition-colors flex-shrink-0 ${
          theme === "dark"
            ? "text-gray-400 hover:text-white hover:bg-white/10"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        }`}
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      {/* Hidden spacer on desktop (keeps search centered) */}
      <div className="hidden md:block flex-shrink-0 w-8" />

      {/* Center: Search bar */}
      <SearchBar />

      {/* Right: Theme toggle */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <ThemeToggle />
      </div>
    </header>
  );
}
