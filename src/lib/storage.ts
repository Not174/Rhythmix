// Firebase Storage helpers — rewritten for Supabase Storage
// Buckets needed: "audio" (public) and "covers" (public)
import { supabase } from "./supabase";

/**
 * Upload an audio file to Supabase Storage and return its public URL.
 */
export async function uploadAudio(file: File): Promise<string> {
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const { error } = await supabase.storage
    .from("audio")
    .upload(fileName, file, { upsert: false, contentType: file.type });
  if (error) throw error;

  const { data } = supabase.storage.from("audio").getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Upload a cover art image to Supabase Storage and return its public URL.
 */
export async function uploadCoverArt(file: File): Promise<string> {
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const { error } = await supabase.storage
    .from("covers")
    .upload(fileName, file, { upsert: false, contentType: file.type });
  if (error) throw error;

  const { data } = supabase.storage.from("covers").getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its full public URL.
 */
export async function deleteFile(publicUrl: string): Promise<void> {
  try {
    // Extract bucket and path from the URL
    // URL format: https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const match = publicUrl.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
    if (!match) return;
    const [, bucket, filePath] = match;
    await supabase.storage.from(bucket).remove([filePath]);
  } catch (err) {
    console.warn("Failed to delete file from storage:", err);
  }
}
