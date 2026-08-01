"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAudio } from "@/context/AudioContext";
import { useRouter } from "next/navigation";

export default function MiniPlayer() {
  const { theme } = useTheme();
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlayPause,
    playNext,
    playPrevious,
    stopSong,
  } = useAudio();
  const router = useRouter();

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 md:left-60 z-50 h-20 flex items-center
        transition-all duration-300 border-t animate-slide-up
        ${
          theme === "dark"
            ? "bg-dark-900/95 border-white/5"
            : "bg-white/90 border-gray-200"
        }
      `}
      style={{ backdropFilter: "blur(20px)" }}
    >
      {/* Progress bar — thin line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-dark-700">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between w-full px-4 md:px-6">
        {/* Song info */}
        <button
          onClick={() => router.push(`/player/${currentSong.id}`)}
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer text-left"
        >
          {currentSong.cover_url ? (
            <img
              src={currentSong.cover_url}
              alt={currentSong.title}
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-md flex-shrink-0"
            />
          ) : (
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                theme === "dark" ? "bg-dark-600" : "bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          )}
          <div className="min-w-0">
            <p
              className={`text-sm font-medium truncate ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {currentSong.title}
            </p>
            <p
              className={`text-xs truncate ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Now Playing
            </p>
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Previous — hidden on very small screens */}
          <button
            onClick={playPrevious}
            className={`hidden sm:flex w-8 h-8 items-center justify-center rounded-full cursor-pointer transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className={`
              w-10 h-10 flex items-center justify-center rounded-full cursor-pointer
              transition-all shadow-lg hover:scale-105
              bg-gradient-to-r from-brand-500 to-accent-500 text-white
            `}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Cancel / Stop button */}
        <div className="flex items-center justify-end flex-1">
          <button
            onClick={stopSong}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all
              ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-white/10"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
            title="Cancel playing music"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
