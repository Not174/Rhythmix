"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/context/ThemeContext";
import { Category, updateCategory } from "@/lib/supabase";

interface EditCategoryModalProps {
  category: Category;
  onClose: () => void;
  onUpdated: (updated: { name: string; color: string; icon: string }) => void;
}

const EMOJI_PRESETS = [
  "🎵", "🎶", "🎸", "🎹", "🎧", "🎙️", "🎷", "🥁",
  "🎤", "📀", "🔥", "❤️", "🌟", "✨", "📻", "🎺",
];

export default function EditCategoryModal({
  category,
  onClose,
  onUpdated,
}: EditCategoryModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon || "🎵");
  const [color, setColor] = useState(category.color || "#f9a8d4");
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const finalName = name.trim();
    const finalIcon = icon.trim() || "🎵";

    try {
      await updateCategory(category.id, {
        name: finalName,
        icon: finalIcon,
        color,
      });
      onUpdated({
        name: finalName,
        icon: finalIcon,
        color,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update category:", err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `
    w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors
    ${
      theme === "dark"
        ? "bg-[#1a1a2e] border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50"
        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400"
    }
  `;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full max-w-sm mx-4 rounded-2xl p-5 shadow-2xl
          max-h-[85vh] overflow-y-auto
          ${
            theme === "dark"
              ? "bg-[#16162a] border border-white/10"
              : "bg-white border border-gray-200"
          }
        `}
        style={{
          animation: "fadeInScale 0.2s ease-out",
        }}
      >
        {/* Header & Cross (X) Cancel Button */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-base font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Edit Category
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`
              w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors
              ${
                theme === "dark"
                  ? "hover:bg-white/10 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
              }
            `}
            title="Cancel edit"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Emoji / Icon input */}
          <div>
            <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Emoji / Icon
            </label>
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xl shadow-inner border border-gray-200 dark:border-white/10 flex-shrink-0"
                style={{ backgroundColor: color }}
              >
                {icon || "🎵"}
              </div>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Type or paste emoji"
                className={`${inputClass} flex-1`}
              />
            </div>

            {/* Compact emoji presets */}
            <div className={`flex flex-wrap gap-1 p-1.5 rounded-lg border ${theme === "dark" ? "bg-[#1a1a2e] border-white/5" : "bg-gray-50 border-gray-200/50"}`}>
              {EMOJI_PRESETS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`
                    w-7 h-7 rounded-md text-sm flex items-center justify-center cursor-pointer transition-transform
                    hover:scale-110 active:scale-95
                    ${
                      icon === emoji
                        ? "bg-purple-500/20 border border-purple-500"
                        : theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-200"
                    }
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Category Name */}
          <div>
            <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pop, Rock, Classical"
              required
              className={inputClass}
            />
          </div>

          {/* Card Color */}
          <div>
            <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Card Color
            </label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/10 cursor-pointer overflow-hidden relative shadow-sm flex-shrink-0"
                style={{ backgroundColor: color }}
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className={`text-xs font-mono ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{color.toUpperCase()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors
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
              type="submit"
              disabled={saving || !name.trim()}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Inline keyframe for portal animation */}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );

  // Render via portal to document.body so it floats above everything
  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
