// Seed default categories into Supabase if the table is empty
import { supabase } from "./supabase";

const DEFAULT_CATEGORIES = [
  { name: "Pop", color: "#f9a8d4", icon: "🎤" },
  { name: "Rock", color: "#fca5a5", icon: "🎸" },
  { name: "Hip-Hop", color: "#fcd34d", icon: "🎧" },
  { name: "Classical", color: "#c4b5fd", icon: "🎻" },
  { name: "Lo-fi", color: "#67e8f9", icon: "🌙" },
  { name: "Bangla", color: "#6ee7b7", icon: "🇧🇩" },
  { name: "Jazz", color: "#fdba74", icon: "🎷" },
  { name: "Electronic", color: "#93c5fd", icon: "⚡" },
];

export async function seedCategories(): Promise<void> {
  try {
    // Check if categories already exist
    const { count } = await supabase
      .from("categories")
      .select("id", { count: "exact", head: true });

    if (count && count > 0) return; // Already seeded

    // Insert default categories
    const { error } = await supabase.from("categories").insert(DEFAULT_CATEGORIES);
    if (error) throw error;

    console.log("✅ Default categories seeded into Supabase.");
  } catch (err) {
    console.error("Failed to seed categories:", err);
  }
}
