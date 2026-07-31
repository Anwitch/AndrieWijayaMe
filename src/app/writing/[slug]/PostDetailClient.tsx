"use client";

import { useState } from "react";
import { Eyebrow, MonoLink } from "@/components/ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Globe } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface PostDetailClientProps {
  post: Doc<"posts">;
  siteName: string;
}

export default function PostDetailClient({
  post,
  siteName,
}: PostDetailClientProps) {
  const hasIdContent = Boolean(post.titleId && post.contentId);
  const [lang, setLang] = useState<"en" | "id">("en");

  const title = lang === "id" && post.titleId ? post.titleId : post.title;
  const content =
    lang === "id" && post.contentId ? post.contentId : post.content;

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 md:py-24 animate-fade-in-up">
      <div className="flex items-center justify-between mb-12">
        <MonoLink href="/writing" className="group">
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          {lang === "id" ? "Kembali ke Arsip" : "Back to Archive"}
        </MonoLink>

        <div className="flex items-center gap-2 border border-line rounded-sm p-1.5 bg-surface">
          <Globe size={14} className="text-ink-muted ml-1" />
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`font-mono text-xs px-2.5 py-1 rounded-sm transition-colors ${
              lang === "en"
                ? "bg-accent text-white font-medium"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("id")}
            className={`font-mono text-xs px-2.5 py-1 rounded-sm transition-colors ${
              lang === "id"
                ? "bg-accent text-white font-medium"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            ID
          </button>
        </div>
      </div>

      {lang === "id" && !hasIdContent && (
        <div className="mb-8 p-4 border border-line bg-surface text-xs font-mono text-ink-muted rounded-sm">
          ℹ️ Versi Bahasa Indonesia secara penuh belum tersedia untuk artikel ini. Menampilkan versi Bahasa Inggris.
        </div>
      )}

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Eyebrow tone="accent">{post.category}</Eyebrow>
          <span className="w-1 h-1 rounded-full bg-line-strong"></span>
          <span className="font-mono text-xs text-ink-muted">
            {new Date(post.publishedAt).toLocaleDateString(
              lang === "id" ? "id-ID" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-ink leading-tight mb-8">
          {title}
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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>

      <section className="mt-24 pt-12 border-t border-line">
        <div className="bg-surface p-8 rounded-sm">
          <Eyebrow as="h3" className="block mb-4">
            {lang === "id" ? "Catatan Khusus" : "Transmission End"}
          </Eyebrow>
          <p className="text-sm text-ink-secondary italic">
            {lang === "id"
              ? `Anda sedang membaca jurnal digital dari ${siteName}. Pengamatan dan catatan teknis lapangan.`
              : `You are reading a mission log from the digital journal of ${siteName}. Observations and technical notes recorded in the field.`}
          </p>
        </div>
      </section>
    </main>
  );
}
