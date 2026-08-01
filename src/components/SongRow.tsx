"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAudio } from "@/context/AudioContext";
import { Song } from "@/lib/supabase";
import SongContextMenu from "./SongContextMenu";
import { useRouter } from "next/navigation";

interface SongRowProps {
  song: Song;
  index: number;
  onDeleted?: () => void;
  queue?: Song[];
}

export default function SongRow({ song, index, onDeleted, queue }: SongRowProps) {
  const { theme } = useTheme();
  const { playSong } = useAudio();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Format duration from seconds
  const formatDuration = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s.toString().padStart(2, "0")}`;
  };

  // Format date
  const formatDate = (ts: { seconds: number; nanoseconds: number } | Date | number | string): string => {
    const date =
      typeof ts === "number" || typeof ts === "string"
        ? new Date(ts)
        : ts instanceof Date
        ? ts
        : new Date((ts as { seconds: number }).seconds * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Close menu on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleRowClick = () => {
    const currentQueue = queue && queue.length > 0 ? queue : [song];
    playSong(song, currentQueue);
    router.push(`/player/${song.id}`);
  };

  return (
    <div
      className={`
        group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer
        transition-all duration-200
        ${
          theme === "dark"
            ? "hover:bg-white/5"
            : "hover:bg-gray-50"
        }
      `}
      onClick={handleRowClick}
    >
      {/* Index number */}
      <span
        className={`w-6 text-center text-sm font-medium tabular-nums ${
          theme === "dark" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {index + 1}
      </span>

      {/* Cover art */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
        {song.cover_url ? (
          <img
            src={song.cover_url}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              theme === "dark" ? "bg-dark-600" : "bg-gray-100"
            }`}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}

        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {song.title}
        </p>
        <p
          className={`text-xs truncate mt-0.5 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {song.category_ids.length} {song.category_ids.length === 1 ? "category" : "categories"}
        </p>
      </div>

      {/* Upload date */}
      <span
        className={`hidden sm:block text-xs ${
          theme === "dark" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {song.created_at ? formatDate(song.created_at) : "—"}
      </span>

      {/* Duration */}
      <span
        className={`text-xs tabular-nums ${
          theme === "dark" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {song.duration ? formatDuration(song.duration) : "—"}
      </span>

      {/* 3-dot menu */}
      <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-all cursor-pointer
            ${
              theme === "dark"
                ? "hover:bg-white/10 text-gray-400"
                : "hover:bg-gray-200 text-gray-500"
            }
          `}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {menuOpen && (
          <SongContextMenu
            song={song}
            onClose={() => setMenuOpen(false)}
            onDeleted={onDeleted}
          />
        )}
      </div>
    </div>
  );
}
