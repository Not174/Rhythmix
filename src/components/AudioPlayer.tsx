"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAudio, LoopMode } from "@/context/AudioContext";

export default function AudioPlayer() {
  const { theme } = useTheme();
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    loopMode,
    shuffleMode,
    togglePlayPause,
    seek,
    setVolume,
    playNext,
    playPrevious,
    toggleLoop,
    toggleShuffle,
  } = useAudio();

  const [showLyrics, setShowLyrics] = useState(false);

  if (!currentSong) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          theme === "dark" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <p className="text-lg">Select a song to start playing</p>
      </div>
    );
  }

  // Format time display
  const formatTime = (secs: number): string => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const loopIcons: Record<LoopMode, { label: string; active: boolean }> = {
    none: { label: "No Loop", active: false },
    one: { label: "Loop One", active: true },
    all: { label: "Loop All", active: true },
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-4 max-w-2xl mx-auto w-full overflow-hidden">
      {/* Cover Art */}
      <div className="relative mb-5 flex-shrink-0">
        <div
          className={`
            w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden shadow-2xl
            transition-all duration-500
            ${isPlaying ? "animate-pulse-glow" : ""}
          `}
        >
          {currentSong.cover_url ? (
            <img
              src={currentSong.cover_url}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${
                theme === "dark"
                  ? "bg-gradient-to-br from-dark-700 to-dark-900"
                  : "bg-gradient-to-br from-brand-100 to-brand-200"
              }`}
            >
              <svg
                className={`w-20 h-20 ${
                  theme === "dark" ? "text-gray-600" : "text-brand-300"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Song Title & Status */}
      <div className="text-center mb-4 flex-shrink-0">
        <h1
          className={`text-xl sm:text-2xl font-bold truncate max-w-md ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {currentSong.title}
        </h1>
        <p
          className={`text-xs mt-0.5 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Now Playing
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-4 flex-shrink-0">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          className={`w-full ${
            theme === "dark" ? "bg-dark-600" : "bg-gray-200"
          }`}
        />
        <div className="flex justify-between mt-1">
          <span
            className={`text-xs tabular-nums ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {formatTime(progress)}
          </span>
          <span
            className={`text-xs tabular-nums ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Main Playback Controls */}
      <div className="flex items-center gap-5 mb-5 flex-shrink-0">
        {/* Shuffle */}
        <button
          onClick={toggleShuffle}
          className={`w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all ${
            shuffleMode
              ? theme === "dark"
                ? "text-accent-400 bg-accent-500/20"
                : "text-brand-600 bg-brand-100"
              : theme === "dark"
              ? "text-gray-500 hover:text-gray-300"
              : "text-gray-400 hover:text-gray-600"
          }`}
          title={shuffleMode ? "Shuffle On" : "Shuffle Off"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h4l3 9h6l3-9h4M4 20h4l3-9M17 20l3-9" />
          </svg>
        </button>

        {/* Previous */}
        <button
          onClick={playPrevious}
          className={`w-11 h-11 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
            theme === "dark"
              ? "text-gray-300 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          className={`
            w-14 h-14 flex items-center justify-center rounded-full cursor-pointer
            transition-all shadow-xl hover:scale-105 active:scale-95
            bg-gradient-to-r from-brand-500 to-accent-500 text-white
          `}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={playNext}
          className={`w-11 h-11 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
            theme === "dark"
              ? "text-gray-300 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        {/* Loop */}
        <button
          onClick={toggleLoop}
          className={`
            w-9 h-9 flex items-center justify-center rounded-full cursor-pointer
            transition-all duration-300 relative active:scale-125 hover:scale-110
            ${
              loopIcons[loopMode].active
                ? theme === "dark"
                  ? "text-accent-400 bg-accent-500/25 shadow-md shadow-accent-500/20 scale-105"
                  : "text-brand-600 bg-brand-100 shadow-md scale-105"
                : theme === "dark"
                ? "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }
          `}
          title={loopIcons[loopMode].label}
        >
          <svg
            key={loopMode}
            className={`w-4 h-4 transition-transform duration-500 ${
              loopMode === "all"
                ? "rotate-180 scale-110"
                : loopMode === "one"
                ? "scale-110"
                : "scale-100"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loopMode === "one" && (
            <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold bg-accent-500 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all animate-pulse">
              1
            </span>
          )}
        </button>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-3 w-full max-w-xs mb-3 flex-shrink-0">
        <svg
          className={`w-4 h-4 flex-shrink-0 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={`flex-1 ${
            theme === "dark" ? "bg-dark-600" : "bg-gray-200"
          }`}
        />
      </div>

      {/* Lyrics button */}
      <button
        onClick={() => setShowLyrics(!showLyrics)}
        className={`
          px-3 py-1 text-xs font-medium transition-all cursor-pointer flex-shrink-0 rounded-lg
          ${
            showLyrics
              ? theme === "dark"
                ? "bg-accent-500/20 text-accent-400"
                : "bg-brand-100 text-brand-600"
              : theme === "dark"
              ? "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }
        `}
      >
        {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
      </button>

      {/* Lyrics panel */}
      {showLyrics && currentSong.lyrics && (
        <div
          className={`
            w-full max-w-md mt-2 p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto
            animate-fade-in flex-shrink-0
            ${
              theme === "dark"
                ? "bg-dark-700/50 text-gray-300 border border-white/5"
                : "bg-gray-50 text-gray-700 border border-gray-200"
            }
          `}
          lang="bn"
        >
          {currentSong.lyrics}
        </div>
      )}

      {showLyrics && !currentSong.lyrics && (
        <p
          className={`text-xs mt-2 flex-shrink-0 ${
            theme === "dark" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          No lyrics available for this song.
        </p>
      )}
    </div>
  );
}
