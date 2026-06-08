const PLACEHOLDER = "/iPhone_01.png";

function isValidImageSrc(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    new URL(src);
    return true;
  } catch {
    return false;
  }
}

export function resolveImageSrc(src?: string | null): string {
  if (!src || !src.trim()) return PLACEHOLDER;

  let cleanSrc = src.trim().replace("./../public", "");

  if (cleanSrc.startsWith("uploads/")) {
    cleanSrc = `/${cleanSrc}`;
  }

  if (cleanSrc.startsWith("/uploads/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    cleanSrc = `${apiBase}${cleanSrc}`;
  } else if (!cleanSrc.startsWith("/") && !cleanSrc.startsWith("http")) {
    cleanSrc = `/${cleanSrc.replace(/^\.?\//, "")}`;
  }

  return isValidImageSrc(cleanSrc) ? cleanSrc : PLACEHOLDER;
}
