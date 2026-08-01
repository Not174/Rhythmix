"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { createCategory } from "@/lib/supabase";

interface CreateCategoryModalProps {
  onClose: () => void;
  onCreated: (newCategoryId: string) => void;
}

export default function CreateCategoryModal({
  onClose,
  onCreated,
}: CreateCategoryModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#f9a8d4"); // Default pastel light pink
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      // Default icon to "🎵" to satisfy the database schema
      const id = await createCategory(name.trim(), color, "🎵");
      onCreated(id);
    } catch (err) {
      console.error("Failed to create category:", err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `
    w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors
    ${theme === "dark"
      ? "bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:border-accent-500/50"
      : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-400"
    }
  `;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-md mx-4 rounded-2xl p-6 shadow-2xl animate-fade-in
          ${theme === "dark"
            ? "bg-dark-800 border border-white/10"
            : "bg-white border border-gray-200"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"
              }`}
          >
            Create New Category
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${theme === "dark"
                ? "hover:bg-white/10 text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-500 dark:text-gray-400">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pop, Rock, Classical, Bangla"
              required
              className={inputClass}
            />
          </div>

          {/* Color Select */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-500 dark:text-gray-400">
              Card Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/10 cursor-pointer overflow-hidden relative"
                style={{ backgroundColor: color }}
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{color.toUpperCase()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className={`
                px-5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors
                ${theme === "dark"
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
              className={`
                px-5 py-2 rounded-xl text-sm font-medium text-white cursor-pointer
                transition-all disabled:opacity-50 disabled:cursor-not-allowed
                bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600
                shadow-lg hover:shadow-xl
              `}
            >
              {saving ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
