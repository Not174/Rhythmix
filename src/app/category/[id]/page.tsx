"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAudio } from "@/context/AudioContext";
import {
  Category,
  Song,
  getCategoryById,
  getSongsByCategory,
} from "@/lib/supabase";
import SongRow from "@/components/SongRow";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { playSong, setQueue } = useAudio();
  const router = useRouter();

  const [category, setCategory] = useState<Category | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [cat, songList] = await Promise.all([
        getCategoryById(id),
        getSongsByCategory(id),
      ]);
      setCategory(cat);
      setSongs(songList);
    } catch (err) {
      console.error("Error loading category:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    setQueue(songs);
    playSong(songs[0], songs);
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className={`flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer transition-colors ${
          theme === "dark"
            ? "text-gray-400 hover:text-white"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      {/* Category header */}
      {category && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-xl"
            style={{ backgroundColor: category.color }}
          >
            {category.icon}
          </div>
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Category
            </p>
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {category.name}
            </h1>
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>
      )}

      {/* Play all button */}
      {songs.length > 0 && (
        <div className="mb-6">
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-medium text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play All
          </button>
        </div>
      )}

      {/* Song list header */}
      {songs.length > 0 && (
        <div
          className={`flex items-center gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider border-b mb-2 ${
            theme === "dark"
              ? "text-gray-500 border-white/5"
              : "text-gray-400 border-gray-200"
          }`}
        >
          <span className="w-6 text-center">#</span>
          <span className="w-12" />
          <span className="flex-1">Title</span>
          <span className="hidden sm:block w-24">Date</span>
          <span className="w-12">Time</span>
          <span className="w-8" />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-16 rounded-xl animate-pulse ${
                theme === "dark" ? "bg-dark-700" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
      )}

      {/* Songs */}
      {!loading &&
        songs.map((song, i) => (
          <SongRow
            key={song.id}
            song={song}
            index={i}
            queue={songs}
            onDeleted={fetchData}
          />
        ))}

      {/* Empty */}
      {!loading && songs.length === 0 && (
        <div
          className={`text-center py-20 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-lg font-medium">No songs yet</p>
          <p className="text-sm mt-1">
            Upload songs and assign them to this category.
          </p>
        </div>
      )}
    </div>
  );
}
