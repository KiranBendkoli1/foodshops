export const optimizeImageUrl = (url, { width = 960, quality = 70 } = {}) => {
  if (!url || typeof url !== "string") return url;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname;

    // Supabase Storage supports width/quality transformations.
    if (host.includes("supabase.co")) {
      parsed.searchParams.set("width", String(width));
      parsed.searchParams.set("quality", String(quality));
      parsed.searchParams.set("format", "webp");
      return parsed.toString();
    }

    // Unsplash supports dpr/format/quality transformations.
    if (host.includes("unsplash.com")) {
      parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("q", String(quality));
      parsed.searchParams.set("fm", "webp");
      return parsed.toString();
    }

    return parsed.toString();
  } catch {
    return url;
  }
};
