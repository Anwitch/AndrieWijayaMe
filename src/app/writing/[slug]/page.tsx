import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import PublicShell from "@/components/PublicShell";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings.server";
import { SITE_URL } from "@/lib/site-url";

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
  const jsonLd = {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24 animate-fade-in-up">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-12 group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Archive
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-light)]">
              {post.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="font-mono text-xs text-gray-400">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--text-primary)] leading-tight mb-8">
            {post.title}
          </h1>
          <div className="h-1 w-16 bg-[var(--accent-primary)]" />
        </header>

        <article
          className="prose prose-slate max-w-none
          prose-headings:text-[var(--text-primary)] prose-headings:font-semibold
          prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed prose-p:mb-6
          prose-strong:text-[var(--text-primary)] prose-strong:font-semibold
          prose-code:text-[var(--accent-primary)] prose-code:bg-[var(--bg-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[var(--text-primary)] prose-pre:text-white prose-pre:rounded-sm
          prose-blockquote:border-l-[var(--accent-primary)] prose-blockquote:italic prose-blockquote:text-[var(--text-secondary)]"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        <section className="mt-24 pt-12 border-t border-[var(--border-default)]">
          <div className="bg-[var(--bg-secondary)] p-8 rounded-sm">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4">
              Transmission End
            </h3>
            <p className="text-sm text-[var(--text-secondary)] italic">
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
