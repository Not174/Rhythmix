"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Song, deleteSongDoc } from "@/lib/supabase";
import { deleteFile } from "@/lib/storage";
import EditSongModal from "./EditSongModal";

interface SongContextMenuProps {
  song: Song;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function SongContextMenu({
  song,
  onClose,
  onDeleted,
}: SongContextMenuProps) {
  const { theme } = useTheme();
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleDownload = async () => {
    try {
      // Trigger browser download of the audio file
      const response = await fetch(song.audio_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${song.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${song.title}"? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      // Delete files from Storage
      if (song.audio_url) await deleteFile(song.audio_url);
      if (song.cover_url) await deleteFile(song.cover_url);
      // Delete Supabase row
      await deleteSongDoc(song.id);
      onDeleted?.();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
      onClose();
    }
  };

  const menuItems = [
    {
      label: "Edit",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      action: handleEdit,
    },
    {
      label: "Download",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      action: handleDownload,
    },
    {
      label: deleting ? "Deleting..." : "Delete",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      action: handleDelete,
      danger: true,
    },
  ];

  return (
    <>
      <div
        className={`
          absolute right-0 top-full mt-1 w-44 rounded-xl overflow-hidden z-50
          shadow-2xl animate-fade-in
          ${
            theme === "dark"
              ? "bg-dark-700 border border-white/10"
              : "bg-white border border-gray-200"
          }
        `}
      >
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            disabled={deleting && item.label === "Deleting..."}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
              transition-colors cursor-pointer
              ${
                item.danger
                  ? theme === "dark"
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-red-500 hover:bg-red-50"
                  : theme === "dark"
                  ? "text-gray-300 hover:bg-white/5"
                  : "text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Edit modal */}
      {showEdit && (
        <EditSongModal
          song={song}
          onClose={() => {
            setShowEdit(false);
            onClose();
          }}
          onSaved={() => {
            setShowEdit(false);
            onClose();
            onDeleted?.(); // Trigger refetch
          }}
        />
      )}
    </>
  );
}
