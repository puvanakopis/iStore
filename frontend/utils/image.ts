const PLACEHOLDER = "/iPhone_01.png";

export function resolveImageSrc(src?: string | null): string {
  if (!src) return PLACEHOLDER;

  let cleanSrc = src.trim();

  cleanSrc = cleanSrc.replace("./../public", "");

  if (cleanSrc.startsWith("uploads/")) {
    cleanSrc = `/${cleanSrc}`;
  }

  if (cleanSrc.startsWith("/uploads/")) {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    return `${apiBase}${cleanSrc}`;
  }

  if (
    cleanSrc.startsWith("http://") ||
    cleanSrc.startsWith("https://")
  ) {
    return cleanSrc;
  }

  if (!cleanSrc.startsWith("/")) {
    cleanSrc = `/${cleanSrc}`;
  }

  return cleanSrc;
}