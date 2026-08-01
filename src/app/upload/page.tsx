"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Category, getCategories, createSong } from "@/lib/supabase";
import { uploadAudio, uploadCoverArt } from "@/lib/storage";
import { useRouter } from "next/navigation";
import CreateCategoryModal from "@/components/CreateCategoryModal";

export default function UploadPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // Preview cover art
  useEffect(() => {
    if (coverFile) {
      const url = URL.createObjectURL(coverFile);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCoverPreview(null);
    }
  }, [coverFile]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAudioFile(file);
    if (file) {
      // Auto-populate title with file name (without extension)
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }
  };

  const handleCategoryCreated = async (newId: string) => {
    try {
      const updatedCats = await getCategories();
      setCategories(updatedCats);
      setSelectedCategories((prev) => [...prev, newId]);
    } catch (err) {
      console.error("Failed to refresh categories:", err);
    }
    setShowCreateModal(false);
  };

  // Extract audio duration client-side
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration);
        URL.revokeObjectURL(audio.src);
      });
      audio.addEventListener("error", () => resolve(0));
      audio.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !title.trim() || selectedCategories.length === 0) return;

    setUploading(true);
    try {
      // 1. Extract duration
      setProgress("Extracting audio metadata...");
      const duration = await getAudioDuration(audioFile);

      // 2. Upload audio
      setProgress("Uploading audio file...");
      const audioUrl = await uploadAudio(audioFile);

      // 3. Upload cover art (optional)
      let coverUrl = "";
      if (coverFile) {
        setProgress("Uploading cover art...");
        coverUrl = await uploadCoverArt(coverFile);
      }

      // 4. Save to Supabase
      setProgress("Saving song data...");
      await createSong({
        title: title.trim(),
        audio_url: audioUrl,
        cover_url: coverUrl,
        lyrics,
        category_ids: selectedCategories,
        duration,
      });

      setProgress("Done! Redirecting...");
      setTimeout(() => router.push("/"), 1000);
    } catch (err) {
      console.error("Upload error:", err);
      setProgress("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const inputClass = `
    w-full rounded-xl px-4 py-3 text-sm outline-none transition-all
    ${
      theme === "dark"
        ? "bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:border-accent-500/50"
        : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-400 shadow-sm"
    }
  `;

  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
    theme === "dark" ? "text-gray-400" : "text-gray-500"
  }`;

  return (
    <div className="px-8 py-8 max-w-2xl mx-auto">
      <h1
        className={`text-3xl font-bold mb-2 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Upload a Song
      </h1>
      <p
        className={`text-sm mb-8 ${
          theme === "dark" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        Share your music with the world. Fill in the details below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className={labelClass}>Song Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title"
            required
            className={inputClass}
          />
        </div>

        {/* Audio file */}
        <div>
          <label className={labelClass}>Audio File *</label>
          <div
            onClick={() => audioInputRef.current?.click()}
            className={`
              ${inputClass} flex items-center gap-3 cursor-pointer
              ${audioFile ? "" : "justify-center py-8"}
            `}
          >
            {audioFile ? (
              <>
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate">{audioFile.name}</span>
              </>
            ) : (
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p className="text-xs opacity-60">Click to select an audio file</p>
              </div>
            )}
          </div>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            className="hidden"
          />
        </div>

        {/* Cover Art */}
        <div>
          <label className={labelClass}>Cover Art</label>
          <div className="flex items-start gap-4">
            {/* Preview */}
            <div
              onClick={() => coverInputRef.current?.click()}
              className={`
                w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer
                flex items-center justify-center transition-all hover:opacity-80
                ${
                  theme === "dark"
                    ? "bg-dark-700 border border-white/10"
                    : "bg-gray-50 border border-gray-200"
                }
              `}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className={`${inputClass} file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold
                  ${
                    theme === "dark"
                      ? "file:bg-accent-500/20 file:text-accent-400"
                      : "file:bg-brand-100 file:text-brand-600"
                  }
                `}
              />
              <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
                Recommended: Square image, at least 500×500px
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={`block text-xs font-semibold uppercase tracking-wider ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>Categories *</label>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors ${
                theme === "dark"
                  ? "text-accent-400 hover:text-accent-300"
                  : "text-brand-500 hover:text-brand-700"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add New Category
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                    ${
                      isSelected
                        ? "text-white shadow-md scale-[1.02]"
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
          {categories.length === 0 && (
            <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
              Loading categories...
            </p>
          )}
        </div>

        {/* Lyrics */}
        <div>
          <label className={labelClass}>Lyrics (supports Bangla / বাংলা)</label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={6}
            lang="bn"
            placeholder="গানের কথা লিখুন... / Enter lyrics here..."
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={uploading || !audioFile || !title.trim() || selectedCategories.length === 0}
            className={`
              w-full py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600
              shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]
            `}
          >
            {uploading ? progress : "Upload Song"}
          </button>
        </div>
      </form>

      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCategoryCreated}
        />
      )}
    </div>
  );
}
