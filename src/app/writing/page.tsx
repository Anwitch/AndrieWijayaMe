"use client";

import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PublicShell from "@/components/PublicShell";
import {
  Button,
  EmptyState,
  Eyebrow,
  PageHeader,
  Skeleton,
} from "@/components/ui";
import Link from "next/link";
import { Globe } from "lucide-react";

export default function WritingPage() {
  const [lang, setLang] = useState<"en" | "id">("en");
  const { results: posts, status, loadMore } = usePaginatedQuery(
    api.posts.listPublished,
    {},
    { initialNumItems: 20 },
  );
  const isLoading = status === "LoadingFirstPage";

  return (
    <PublicShell>
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <PageHeader
            eyebrow="Archive"
            title={lang === "id" ? "Jurnal Teknis" : "Mission Logs"}
            lede={
              lang === "id"
                ? "Catatan lapangan digital, arsitektur sistem, dan analisis teknis."
                : "Technical insights, project post-mortems, and digital field notes."
            }
          />
          <div className="flex items-center gap-2 border border-line rounded-sm p-1.5 bg-surface self-start">
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

        <div className="grid grid-cols-1 gap-10">
          {isLoading ? (
            <div className="animate-pulse space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-line pb-8">
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState>No mission logs found in frequency.</EmptyState>
          ) : (
            posts.map((post) => {
              const title =
                lang === "id" && post.titleId ? post.titleId : post.title;
              const excerpt =
                lang === "id" && post.excerptId ? post.excerptId : post.excerpt;

              return (
                <article
                  key={post._id}
                  className="group border-b border-line pb-12 last:border-0"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
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
                  </div>

                  <Link href={`/writing/${post.slug}`} className="block group">
                    <h2 className="text-2xl font-semibold text-ink group-hover:text-accent transition-colors mb-4">
                      {title}
                    </h2>
                    <p className="text-lg text-ink-secondary leading-relaxed max-w-prose mb-6">
                      {excerpt}
                    </p>
                    <Eyebrow
                      as="div"
                      className="group-hover:text-ink transition-colors"
                    >
                      {lang === "id" ? "Baca Selengkapnya →" : "Read Log →"}
                    </Eyebrow>
                  </Link>
                </article>
              );
            })
          )}
        </div>
        {status !== "Exhausted" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => loadMore(20)}
            disabled={status === "LoadingMore"}
            className="mt-12 w-full"
          >
            {status === "LoadingMore"
              ? lang === "id"
                ? "Memuat Artikel..."
                : "Loading Logs..."
              : lang === "id"
                ? "Muat Lebih Banyak"
                : "Load More Logs"}
          </Button>
        )}
      </main>
    </PublicShell>
  );
}
