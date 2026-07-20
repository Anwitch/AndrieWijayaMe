/**
 * Absolute origin for the public site. Used for metadataBase, canonical URLs,
 * Open Graph tags, sitemap, and robots. Override per-environment with
 * NEXT_PUBLIC_SITE_URL (no trailing slash needed).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "https://anwitch.me";
