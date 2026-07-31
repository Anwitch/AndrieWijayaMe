import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import PublicShell from "@/components/PublicShell";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings.server";
import { SITE_URL } from "@/lib/site-url";
import { breadcrumbSchema } from "@/lib/structured-data";
import PostDetailClient from "./PostDetailClient";

async function getPost(slug: string) {
  try {
    return await fetchQuery(api.posts.getBySlug, { slug });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Log Not Found", robots: { index: false, follow: false } };
  }
  const url = `${SITE_URL}/writing/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: new Date(post.updatedAt ?? post.publishedAt).toISOString(),
      authors: [SITE_URL],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSiteSettings()]);

  if (!post) {
    notFound();
  }

  const url = `${SITE_URL}/writing/${post.slug}`;
  const breadcrumb = breadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Tulisan", path: "/writing" },
    { name: post.title, path: `/writing/${post.slug}` },
  ]);
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt ?? post.publishedAt).toISOString(),
    inLanguage: "id-ID",
    url,
    mainEntityOfPage: url,
    image: `${SITE_URL}/opengraph-image`,
    author: { "@type": "Person", name: settings.siteName, url: SITE_URL },
    publisher: { "@type": "Person", name: settings.siteName, url: SITE_URL },
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogPosting, breadcrumb]),
        }}
      />
      <PostDetailClient post={post} siteName={settings.siteName} />
    </PublicShell>
  );
}
