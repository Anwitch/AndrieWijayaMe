import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { getSiteSettings } from "@/lib/site-settings.server";
import { SITE_URL } from "@/lib/site-url";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const settings = await getSiteSettings();

  let posts: Array<{
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    publishedAt: number;
  }> = [];
  try {
    const result = await fetchQuery(api.posts.listPublished, {
      paginationOpts: { numItems: 100, cursor: null },
    });
    posts = result.page;
  } catch {
    // Serve a valid (possibly empty) feed even if Convex is unreachable.
  }

  const lastBuildDate = new Date(
    posts[0]?.publishedAt ?? Date.now(),
  ).toUTCString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/writing/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(settings.siteName)} — Tulisan</title>
    <link>${SITE_URL}/writing</link>
    <description>${escapeXml(settings.seoDescription)}</description>
    <language>id-ID</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
    },
  });
}
