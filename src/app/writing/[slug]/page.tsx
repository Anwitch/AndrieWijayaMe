import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import PublicShell from "@/components/PublicShell";
import { Eyebrow, MonoLink } from "@/components/ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings.server";
import { SITE_URL } from "@/lib/site-url";
import { breadcrumbSchema } from "@/lib/structured-data";

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
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24 animate-fade-in-up">
        <MonoLink href="/writing" className="mb-12 group">
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Archive
        </MonoLink>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Eyebrow tone="accent">{post.category}</Eyebrow>
            <span className="w-1 h-1 rounded-full bg-line-strong"></span>
            <span className="font-mono text-xs text-ink-muted">
              {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-ink leading-tight mb-8">
            {post.title}
          </h1>
          <div className="h-1 w-16 bg-ink" />
        </header>

        <article
          className="prose max-w-none
          prose-headings:text-ink prose-headings:font-semibold
          prose-p:text-ink-secondary prose-p:leading-relaxed prose-p:mb-6
          prose-strong:text-ink prose-strong:font-semibold
          prose-code:text-accent prose-code:bg-accent-subtle prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-ink prose-pre:text-paper prose-pre:rounded-sm
          prose-blockquote:border-l-ink prose-blockquote:italic prose-blockquote:text-ink-secondary"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        <section className="mt-24 pt-12 border-t border-line">
          <div className="bg-surface p-8 rounded-sm">
            <Eyebrow as="h3" className="block mb-4">
              Transmission End
            </Eyebrow>
            <p className="text-sm text-ink-secondary italic">
              You are reading a mission log from the digital journal of{" "}
              {settings.siteName}. Observations and technical notes recorded in
              the field.
            </p>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
