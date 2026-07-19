"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Navbar from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = useQuery(api.posts.getBySlug, { slug });

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-24 animate-pulse">
          <div className="h-4 bg-gray-100 w-24 mb-6"></div>
          <div className="h-12 bg-gray-100 w-full mb-12"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 w-full"></div>
            <div className="h-4 bg-gray-100 w-full"></div>
            <div className="h-4 bg-gray-100 w-3/4"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Log Not Found</h1>
          <p className="text-gray-500 mb-8">
            The mission log you are looking for does not exist or has been
            redacted.
          </p>
          <Link
            href="/writing"
            className="text-[var(--accent-primary)] font-mono text-xs uppercase tracking-widest hover:underline"
          >
            Back to Archive
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[var(--text-primary)]">
      <Navbar />

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
              You are reading a mission log from the digital journal of Andrie
              Wijaya. Observations and technical notes recorded in the field.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-24 border-t border-[var(--border-default)] py-12">
        <div className="max-w-3xl mx-auto px-6 text-center text-[var(--text-muted)] text-xs font-mono uppercase tracking-widest">
          &copy; 2026 Andrie Wijaya // Signal: Secured
        </div>
      </footer>
    </div>
  );
}
