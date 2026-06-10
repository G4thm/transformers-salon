import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${baseUrl}${path}`;
}

/**
 * Converts a raw Supabase Storage path (e.g. "brand-assets/filename.jpeg") to a full public URL.
 * If the path is already a full URL or starts with "/", it is returned as-is.
 * Returns null if path is null/empty.
 */
export function getSupabaseImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  return `${supabaseUrl}/storage/v1/object/public/${path}`;
}
