"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Category, deleteCategory } from "@/lib/supabase";
import EditCategoryModal from "@/components/EditCategoryModal";

interface CategoryCardProps {
  category: Category;
  onDeleted?: () => void;
  isEditing?: boolean;
  onEditStart?: () => void;
  onEditClose?: () => void;
}

export default function CategoryCard({
  category,
  onDeleted,
  isEditing,
  onEditStart,
  onEditClose,
}: CategoryCardProps) {
  const router = useRouter();
  const [color, setColor] = useState(category.color);
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon || "🎵");

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditStart?.();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      try {
        await deleteCategory(category.id);
        onDeleted?.();
      } catch (err) {
        console.error("Failed to delete category:", err);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => router.push(`/category/${category.id}`)}
        className={`
          relative group rounded-3xl w-full aspect-[1.15/1]
          flex flex-col items-center justify-center
          transition-all duration-300 cursor-pointer overflow-hidden
          hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98]
        `}
        style={{ backgroundColor: color }}
      >
        {/* White tint overlay — makes colour feel light & pastel */}
        <div className="absolute inset-0 bg-white/45 rounded-3xl" />

        {/* Subtle glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(circle at 60% 40%, rgba(255,255,255,0.6) 0%, transparent 70%)`,
          }}
        />

        {/* Action buttons — top right */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {/* Delete category */}
          <div
            onClick={handleDelete}
            className={`
              w-7 h-7 rounded-full flex items-center justify-center cursor-pointer
              opacity-0 group-hover:opacity-100 transition-all duration-200 shadow
              bg-white/60 hover:bg-red-50 text-gray-700 hover:text-red-600
            `}
            title="Delete category"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          {/* Edit category (name, emoji & color) */}
          <div
            onClick={handleEditClick}
            className={`
              w-7 h-7 rounded-full flex items-center justify-center cursor-pointer
              opacity-0 group-hover:opacity-100 transition-all duration-200 shadow
              bg-white/60 hover:bg-white/90 text-gray-700
            `}
            title="Edit category"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>

        {/* Category icon & name — vertically & horizontally centred */}
        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <span className="text-3xl mb-1 drop-shadow-sm select-none">{icon}</span>
          <h3 className="text-lg font-bold tracking-wide text-gray-800 drop-shadow-sm">
            {name}
          </h3>
          <p className="text-xs mt-0.5 font-medium text-gray-600">
            Explore songs
          </p>
        </div>

        {/* Decorative circles */}
        <div
          className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full opacity-70"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute -top-6 -left-6 w-20 h-20 rounded-full opacity-70"
          style={{ backgroundColor: color }}
        />
      </button>

      {/* Floating Edit Category Modal (rendered via portal) */}
      {isEditing && (
        <EditCategoryModal
          category={{ ...category, name, icon, color }}
          onClose={() => onEditClose?.()}
          onUpdated={(updated) => {
            setName(updated.name);
            setIcon(updated.icon);
            setColor(updated.color);
          }}
        />
      )}
    </>
  );
}
