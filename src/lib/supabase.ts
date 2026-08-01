// ─────────────────────────────────────────────────────────────────────────────
// Supabase — single file: client initialisation + all database CRUD helpers
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

/* ──────────────────────── Client ──────────────────────── */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ──────────────────────────── Types ──────────────────────────── */

export type Timestamp = string; // ISO string from Postgres

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: Timestamp;
  // alias for legacy compatibility
  createdAt?: Timestamp;
}

export interface Song {
  id: string;
  title: string;
  audio_url: string;
  cover_url: string;
  lyrics: string;
  category_ids: string[];
  duration: number;
  created_at: Timestamp;
  // aliases for legacy compatibility
  audioUrl?: string;
  coverUrl?: string;
  categoryIds?: string[];
  createdAt?: Timestamp;
}

/* ─── Normalise DB row → app shape (snake_case → camelCase) ─── */

function normCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    color: row.color as string,
    icon: row.icon as string,
    created_at: row.created_at as string,
    createdAt: row.created_at as string,
  };
}

function normSong(row: Record<string, unknown>): Song {
  return {
    id: row.id as string,
    title: row.title as string,
    audio_url: row.audio_url as string,
    cover_url: row.cover_url as string,
    lyrics: (row.lyrics as string) || "",
    category_ids: (row.category_ids as string[]) || [],
    duration: (row.duration as number) || 0,
    created_at: row.created_at as string,
    // camelCase aliases
    audioUrl: row.audio_url as string,
    coverUrl: row.cover_url as string,
    categoryIds: (row.category_ids as string[]) || [],
    createdAt: row.created_at as string,
  };
}

/* ──────────────────────────── Categories ──────────────────────────── */

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data || []).map(normCategory);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return normCategory(data);
}

export async function updateCategoryColor(id: string, color: string) {
  const { error } = await supabase
    .from("categories")
    .update({ color })
    .eq("id", id);
  if (error) throw error;
}

export async function updateCategoryName(id: string, name: string) {
  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id);
  if (error) throw error;
}

export async function createCategory(
  name: string,
  color: string,
  icon: string
): Promise<string> {
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, color, icon })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

/* ──────────────────────────── Songs ──────────────────────────── */

export async function getSongs(): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(normSong);
}

export async function getSongById(id: string): Promise<Song | null> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return normSong(data);
}

export async function getSongsByCategory(categoryId: string): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .contains("category_ids", [categoryId])
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(normSong);
}

export async function searchSongsByName(term: string): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .ilike("title", `%${term}%`)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(normSong);
}

export async function searchSongsByLyrics(term: string): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .ilike("lyrics", `%${term}%`)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(normSong);
}

export async function createSong(
  data: Omit<Song, "id" | "created_at" | "createdAt" | "audioUrl" | "coverUrl" | "categoryIds">
): Promise<string> {
  const { data: row, error } = await supabase
    .from("songs")
    .insert({
      title: data.title,
      audio_url: data.audio_url,
      cover_url: data.cover_url,
      lyrics: data.lyrics,
      category_ids: data.category_ids,
      duration: data.duration,
    })
    .select("id")
    .single();
  if (error) throw error;
  return row.id;
}

export async function updateSong(
  id: string,
  data: Record<string, any>
) {
  const payload: Record<string, any> = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.lyrics !== undefined) payload.lyrics = data.lyrics;
  if (data.duration !== undefined) payload.duration = data.duration;
  if (data.audio_url !== undefined) payload.audio_url = data.audio_url;
  else if (data.audioUrl !== undefined) payload.audio_url = data.audioUrl;
  if (data.cover_url !== undefined) payload.cover_url = data.cover_url;
  else if (data.coverUrl !== undefined) payload.cover_url = data.coverUrl;
  if (data.category_ids !== undefined) payload.category_ids = data.category_ids;
  else if (data.categoryIds !== undefined) payload.category_ids = data.categoryIds;

  const { error } = await supabase.from("songs").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteSongDoc(id: string) {
  const { error } = await supabase.from("songs").delete().eq("id", id);
  if (error) throw error;
}
