"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Category, getCategories } from "@/lib/supabase";
import { seedCategories } from "@/lib/seed";
import CategoryCard from "@/components/CategoryCard";
import CreateCategoryModal from "@/components/CreateCategoryModal";

export default function HomePage() {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        // Seed categories if empty
        await seedCategories();
        await fetchCategories();
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleCategoryCreated = async () => {
    await fetchCategories();
    setShowCreateModal(false);
  };

  return (
    <div className="px-4 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Explore Categories
          </h1>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Discover music across genres. Click a category to browse its songs, or
            use the search bar above.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer
            transition-all text-white bg-gradient-to-r from-brand-500 to-accent-500
            hover:from-brand-600 hover:to-accent-600 shadow-md hover:shadow-lg self-start sm:self-center
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Create Category
        </button>
      </div>

      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCategoryCreated}
        />
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-3xl w-full aspect-[1.15/1] animate-pulse ${
                theme === "dark" ? "bg-dark-700" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
      )}

      {/* Category grid */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <CategoryCard category={cat} onDeleted={fetchCategories} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && categories.length === 0 && (
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-lg font-medium">No categories found</p>
          <p className="text-sm mt-1">Categories will appear here once added.</p>
        </div>
      )}
    </div>
  );
}
