"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAudio } from "@/context/AudioContext";
import { Song, Category, getCategories, getSongById, updateSong } from "@/lib/supabase";
import { uploadCoverArt } from "@/lib/storage";

interface EditSongModalProps {
  song: Song;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditSongModal({ song, onClose, onSaved }: EditSongModalProps) {
  const { theme } = useTheme();
  const { updateCurrentSongDetails } = useAudio();
  const [title, setTitle] = useState(song.title);
  const [lyrics, setLyrics] = useState(song.lyrics || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    song.category_ids || []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: Record<string, any> = {
        title,
        lyrics,
        category_ids: selectedCategories,
      };

      // Upload new cover art if changed
      if (coverFile) {
        const coverUrl = await uploadCoverArt(coverFile);
        updates.cover_url = coverUrl;
      }

      await updateSong(song.id, updates);

      // Fetch fresh updated song and sync with active player context
      const freshSong = await getSongById(song.id);
      if (freshSong) {
        updateCurrentSongDetails(freshSong);
      }

      onSaved();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `
    w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors
    ${
      theme === "dark"
        ? "bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:border-accent-500/50"
        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-400"
    }
  `;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-lg mx-4 rounded-2xl p-6 shadow-2xl animate-fade-in max-h-[85vh] overflow-y-auto
          ${
            theme === "dark"
              ? "bg-dark-800 border border-white/10"
              : "bg-white border border-gray-200"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-lg font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Edit Song
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
              theme === "dark"
                ? "hover:bg-white/10 text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <label className={`block mb-4`}>
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Title
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </label>

        {/* Lyrics */}
        <label className="block mb-4">
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Lyrics (supports Bangla / বাংলা)
          </span>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={5}
            lang="bn"
            className={`${inputClass} mt-1 resize-y`}
            placeholder="গানের কথা লিখুন..."
          />
        </label>

        {/* Cover Art */}
        <label className="block mb-4">
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Swap Cover Art
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className={`${inputClass} mt-1 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold
              ${
                theme === "dark"
                  ? "file:bg-accent-500/20 file:text-accent-400"
                  : "file:bg-brand-100 file:text-brand-600"
              }
            `}
          />
        </label>

        {/* Categories */}
        <div className="mb-6">
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Categories
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer
                    ${
                      isSelected
                        ? "text-white shadow-md"
                        : theme === "dark"
                        ? "bg-dark-600 text-gray-400 hover:bg-dark-500"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }
                  `}
                  style={isSelected ? { backgroundColor: cat.color } : {}}
                >
                  {cat.icon} {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className={`
              px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors
              ${
                theme === "dark"
                  ? "text-gray-400 hover:bg-white/5"
                  : "text-gray-500 hover:bg-gray-100"
              }
            `}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className={`
              px-5 py-2 rounded-xl text-sm font-medium text-white cursor-pointer
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600
              shadow-lg hover:shadow-xl
            `}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
