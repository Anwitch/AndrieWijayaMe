import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * Welcomes every crawler — traditional search (Googlebot, Bingbot) AND AI
 * engines (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended,
 * CCBot, etc.) — since discoverability by AI search is a primary goal. Only the
 * private admin area is disallowed.
 *
 * NOTE: This is only served once Cloudflare's managed robots.txt feature is
 * turned OFF for the zone. While that feature is on, Cloudflare serves/merges
 * its own robots.txt (which blocks AI bots) at the edge and this file is masked.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/thisisandwitch/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
