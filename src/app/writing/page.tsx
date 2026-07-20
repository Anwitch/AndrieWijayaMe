"use client";

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

export default function WritingPage() {
  const { results: posts, status, loadMore } = usePaginatedQuery(
    api.posts.listPublished,
    {},
    { initialNumItems: 20 },
  );
  const isLoading = status === "LoadingFirstPage";

  return (
    <PublicShell>
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 animate-fade-in-up">
        <PageHeader
          eyebrow="Archive"
          title="Mission Logs"
          lede="Technical insights, project post-mortems, and digital field notes."
        />

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
            posts.map((post) => (
              <article
                key={post._id}
                className="group border-b border-line pb-12 last:border-0"
              >
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
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
                </div>

                <Link href={`/writing/${post.slug}`} className="block group">
                  <h2 className="text-2xl font-semibold text-ink group-hover:text-accent transition-colors mb-4">
                    {post.title}
                  </h2>
                  <p className="text-lg text-ink-secondary leading-relaxed max-w-prose mb-6">
                    {post.excerpt}
                  </p>
                  <Eyebrow
                    as="div"
                    className="group-hover:text-ink transition-colors"
                  >
                    Read Log →
                  </Eyebrow>
                </Link>
              </article>
            ))
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
            {status === "LoadingMore" ? "Loading Logs..." : "Load More Logs"}
          </Button>
        )}
      </main>
    </PublicShell>
  );
}
