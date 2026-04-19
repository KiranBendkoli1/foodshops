/**
 * Absolute URL for the deployed app. Set VITE_SITE_URL in production (e.g. https://yourname.github.io/foodshops).
 * Falls back to window.location.origin in the browser.
 */
export function buildAbsoluteUrl(path = "/") {
  const configured = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "");
  const origin =
    configured ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;

  if (!origin) {
    return p;
  }
  if (!basePath) {
    return `${origin}${p}`;
  }
  return `${origin}${basePath}${p}`;
}
