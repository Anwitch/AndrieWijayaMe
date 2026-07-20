import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/writing`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  let posts: MetadataRoute.Sitemap = [];
  try {
    const result = await fetchQuery(api.posts.listPublished, {
      paginationOpts: { numItems: 500, cursor: null },
    });
    posts = result.page.map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // If Convex is unreachable at build/request time, still return static routes.
  }

  return [...staticRoutes, ...posts];
}
