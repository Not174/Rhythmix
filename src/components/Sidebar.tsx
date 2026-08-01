"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

/* ─── SVG Icons ─── */

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const MusicIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const navItems = [
  { href: "/", label: "Home", icon: <HomeIcon /> },
  { href: "/upload", label: "Upload", icon: <UploadIcon /> },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-full w-60 flex flex-col
        transition-all duration-300 ease-in-out border-r
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${
          theme === "dark"
            ? "bg-dark-900/95 border-white/5 text-white"
            : "bg-white/80 border-gray-200 text-gray-900"
        }
      `}
      style={{ backdropFilter: "blur(20px)" }}
    >
      {/* Logo + close button on mobile */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg">
          <MusicIcon />
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent flex-1">
          Rhythmix
        </span>
        {/* Close button — only visible on mobile */}
        <button
          onClick={onClose}
          className={`md:hidden p-1 rounded-lg transition-colors ${
            theme === "dark"
              ? "text-gray-400 hover:text-white hover:bg-white/10"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          }`}
          aria-label="Close sidebar"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        <p
          className={`px-3 mb-2 text-xs font-semibold uppercase tracking-wider ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? theme === "dark"
                          ? "bg-accent-500/20 text-accent-400"
                          : "bg-brand-100 text-brand-700"
                        : theme === "dark"
                        ? "text-gray-400 hover:text-white hover:bg-white/5"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div
          className={`my-6 border-t ${
            theme === "dark" ? "border-white/5" : "border-gray-200"
          }`}
        />

        <p
          className={`px-3 mb-2 text-xs font-semibold uppercase tracking-wider ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Your Library
        </p>

        <div
          className={`px-3 py-8 text-center text-sm ${
            theme === "dark" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          <MusicIcon />
          <p className="mt-2">Discover music on the Home page</p>
        </div>
      </nav>

      {/* Footer branding */}
      <div
        className={`px-6 py-4 text-xs ${
          theme === "dark" ? "text-gray-600" : "text-gray-400"
        }`}
      >
        © 2026 Rhythmix
      </div>
    </aside>
  );
}
