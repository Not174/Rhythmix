"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAudio } from "@/context/AudioContext";
import { getSongById, getSongs } from "@/lib/supabase";
import AudioPlayer from "@/components/AudioPlayer";

export default function PlayerPage() {
  const { songId } = useParams<{ songId: string }>();
  const { theme } = useTheme();
  const { currentSong, playSong, queue, setQueue } = useAudio();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSong() {
      try {
        if (currentSong?.id === songId) {
          setLoading(false);
          return;
        }

        const song = await getSongById(songId);
        if (!song) {
          router.push("/");
          return;
        }

        let currentQueue = queue;
        if (currentQueue.length === 0) {
          currentQueue = await getSongs();
          setQueue(currentQueue);
        }

        playSong(song, currentQueue);
      } catch (err) {
        console.error("Error loading song:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden relative">
      {/* Top Bar with Back Button */}
      <div className="px-4 sm:px-8 pt-4 sm:pt-6 pb-2 flex items-center justify-between z-10">
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors px-3 py-1.5 rounded-lg ${
            theme === "dark"
              ? "text-gray-400 hover:text-white hover:bg-white/5"
              : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Full static player */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <AudioPlayer />
      </div>
    </div>
  );
}
