import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
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

  let projects: MetadataRoute.Sitemap = [];
  try {
    const result = await fetchQuery(api.projects.listPublished, {
      paginationOpts: { numItems: 500, cursor: null },
    });
    projects = result.page
      .filter(
        (project): project is NonNullable<typeof project> =>
          project !== null && Boolean(project.slug),
      )
      .map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: new Date(project.updatedAt ?? project.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    // Convex unreachable — static routes still returned.
  }

  return [...staticRoutes, ...posts, ...projects];
}
