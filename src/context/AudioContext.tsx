"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Song } from "@/lib/supabase";

/* ──────────────────────────── Types ──────────────────────────── */

export type LoopMode = "none" | "one" | "all";

interface AudioContextValue {
  // Current state
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number; // seconds elapsed
  duration: number; // total seconds
  volume: number;

  // Queue & history
  queue: Song[];
  historyStack: Song[];

  // Modes
  loopMode: LoopMode;
  shuffleMode: boolean;

  // Actions
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setQueue: (songs: Song[]) => void;
  updateCurrentSongDetails: (updatedSong: Song) => void;
  stopSong: () => void;

  // Ref for the audio element (needed by some components)
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextValue | null>(null);

/* ──────────────────────────── Provider ──────────────────────────── */

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const [queue, setQueue] = useState<Song[]>([]);
  const [historyStack, setHistoryStack] = useState<Song[]>([]);

  const [loopMode, setLoopMode] = useState<LoopMode>("none");
  const [shuffleMode, setShuffleMode] = useState(false);

  // ─── Play a specific song ───
  const playSong = useCallback(
    (song: Song, newQueue?: Song[]) => {
      // Push current song to history before switching
      if (currentSong) {
        setHistoryStack((prev) => [...prev, currentSong]);
      }

      setCurrentSong(song);
      if (newQueue) setQueue(newQueue);

      // Wait for React to update before playing
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.src = song.audio_url;
          audio.load();
          audio.play().catch(console.error);
          setIsPlaying(true);
        }
      }, 50);
    },
    [currentSong]
  );

  // ─── Toggle play/pause ───
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying, currentSong]);

  // ─── Seek to a specific time ───
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setProgress(time);
    }
  }, []);

  // ─── Set volume ───
  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    const audio = audioRef.current;
    if (audio) audio.volume = vol;
  }, []);

  // ─── Advanced Forward (Next) ───
  const playNext = useCallback(() => {
    if (!currentSong || queue.length === 0) return;

    // Loop current song
    if (loopMode === "one") {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
      return;
    }

    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);

    let nextSong: Song | null = null;

    if (shuffleMode) {
      // Pick a random song that isn't the current one
      const pool = queue.filter((s) => s.id !== currentSong.id);
      if (pool.length > 0) {
        nextSong = pool[Math.floor(Math.random() * pool.length)];
      }
    } else {
      // Sequential
      const nextIndex = currentIndex + 1;
      if (nextIndex < queue.length) {
        nextSong = queue[nextIndex];
      } else if (loopMode === "all") {
        nextSong = queue[0]; // Wrap around
      }
    }

    if (nextSong) {
      playSong(nextSong);
    } else {
      // End of queue, no loop
      setIsPlaying(false);
    }
  }, [currentSong, queue, loopMode, shuffleMode, playSong]);

  // ─── Advanced Backward (Previous) — uses actual history ───
  const playPrevious = useCallback(() => {
    if (historyStack.length === 0) {
      // If no history, restart current song
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
      return;
    }

    const prevSong = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    setCurrentSong(prevSong);

    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.src = prevSong.audio_url;
        audio.load();
        audio.play().catch(console.error);
        setIsPlaying(true);
      }
    }, 50);
  }, [historyStack]);

  // ─── Toggle loop mode: none → one → all → none ───
  const toggleLoop = useCallback(() => {
    setLoopMode((prev) => {
      if (prev === "none") return "one";
      if (prev === "one") return "all";
      return "none";
    });
  }, []);

  // ─── Toggle shuffle ───
  const toggleShuffle = useCallback(() => {
    setShuffleMode((prev) => !prev);
  }, []);

  // ─── Audio element event listeners ───
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (loopMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNext();
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [loopMode, playNext]);

  // Keep volume in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  const updateCurrentSongDetails = useCallback((updatedSong: Song) => {
    setCurrentSong((prev) => (prev?.id === updatedSong.id ? updatedSong : prev));
    setQueue((prev) =>
      prev.map((s) => (s.id === updatedSong.id ? updatedSong : s))
    );
  }, []);

  const stopSong = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    }
    setIsPlaying(false);
    setCurrentSong(null);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration,
        volume,
        queue,
        historyStack,
        loopMode,
        shuffleMode,
        playSong,
        togglePlayPause,
        seek,
        setVolume,
        playNext,
        playPrevious,
        toggleLoop,
        toggleShuffle,
        setQueue,
        updateCurrentSongDetails,
        stopSong,
        audioRef,
      }}
    >
      {/* Hidden global audio element */}
      <audio ref={audioRef} preload="metadata" />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
