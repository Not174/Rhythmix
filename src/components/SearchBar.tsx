"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { searchSongsByName, searchSongsByLyrics, Song } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type SearchMode = "name" | "lyrics";

export default function SearchBar() {
  const { theme } = useTheme();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("name");
  const [results, setResults] = useState<Song[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!value.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const res =
            mode === "name"
              ? await searchSongsByName(value)
              : await searchSongsByLyrics(value);
          setResults(res);
          setIsOpen(true);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setLoading(false);
        }
      }, 400);
    },
    [mode]
  );

  const handleResultClick = (song: Song) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/player/${song.id}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      {/* Search input row */}
      <div
        className={`
          flex items-center rounded-2xl overflow-hidden transition-all duration-300
          ${
            theme === "dark"
              ? "bg-dark-700 border border-white/10 focus-within:border-accent-500/50"
              : "bg-white border border-gray-200 shadow-sm focus-within:border-brand-400"
          }
        `}
      >
        {/* Search icon */}
        <div className="pl-4 pr-2">
          <svg
            className={`w-4 h-4 ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={mode === "name" ? "Search by song name..." : "Search by lyrics..."}
          className={`
            flex-1 py-2.5 pr-2 bg-transparent outline-none text-sm
            ${theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}
          `}
        />

        {/* Mode switcher */}
        <div
          className={`flex items-center border-l mr-1 ${
            theme === "dark" ? "border-white/10" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => setMode("name")}
            className={`
              px-3 py-2 text-xs font-medium transition-colors cursor-pointer
              ${
                mode === "name"
                  ? theme === "dark"
                    ? "text-accent-400"
                    : "text-brand-600"
                  : theme === "dark"
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
              }
            `}
          >
            Name
          </button>
          <button
            onClick={() => setMode("lyrics")}
            className={`
              px-3 py-2 text-xs font-medium transition-colors cursor-pointer
              ${
                mode === "lyrics"
                  ? theme === "dark"
                    ? "text-accent-400"
                    : "text-brand-600"
                  : theme === "dark"
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
              }
            `}
          >
            Lyrics
          </button>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="pr-3">
            <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50
            max-h-80 overflow-y-auto shadow-2xl animate-fade-in
            ${
              theme === "dark"
                ? "bg-dark-800 border border-white/10"
                : "bg-white border border-gray-200"
            }
          `}
        >
          {results.map((song) => (
            <button
              key={song.id}
              onClick={() => handleResultClick(song)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer
                ${
                  theme === "dark"
                    ? "hover:bg-white/5 text-white"
                    : "hover:bg-gray-50 text-gray-900"
                }
              `}
            >
              {/* Cover art thumbnail */}
              {song.cover_url ? (
                <img
                  src={song.cover_url}
                  alt={song.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    theme === "dark" ? "bg-dark-600" : "bg-gray-100"
                  }`}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{song.title}</p>
                <p
                  className={`text-xs truncate ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {mode === "lyrics" && song.lyrics
                    ? song.lyrics.substring(0, 60) + "..."
                    : "Song"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && results.length === 0 && query.trim() && !loading && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-2 rounded-xl px-4 py-6 text-center text-sm z-50
            shadow-2xl animate-fade-in
            ${
              theme === "dark"
                ? "bg-dark-800 border border-white/10 text-gray-400"
                : "bg-white border border-gray-200 text-gray-500"
            }
          `}
        >
          No songs found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
