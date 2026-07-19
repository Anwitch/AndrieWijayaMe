"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Doc } from "../../../convex/_generated/dataModel";

export default function WritingPage() {
  const posts = useQuery(api.posts.listPublished);

  return (
    <div className="min-h-screen bg-white font-sans text-[var(--text-primary)]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16 animate-fade-in-up">
        <header className="mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-light)] mb-2 block">
            Archive
          </span>
          <h1 className="text-4xl font-semibold text-[var(--text-primary)]">
            Mission Logs
          </h1>
          <div className="mt-4 h-px w-16 bg-[var(--accent-primary)]" />
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-prose leading-relaxed">
            Technical insights, project post-mortems, and digital field notes.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {posts === undefined ? (
            <div className="animate-pulse space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-100 pb-8">
                  <div className="h-4 bg-gray-100 w-24 mb-4"></div>
                  <div className="h-8 bg-gray-100 w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-100 w-full"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center border-y border-dashed border-gray-200">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
                No mission logs found in frequency.
              </span>
            </div>
          ) : (
            posts.map((post: Doc<"posts">) => (
              <article
                key={post._id}
                className="group border-b border-gray-100 pb-12 last:border-0"
              >
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
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
                </div>

                <Link href={`/writing/${post.slug}`} className="block group">
                  <h2 className="text-2xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-4">
                    {post.title}
                  </h2>
                  <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-prose mb-6">
                    {post.excerpt}
                  </p>
                  <div className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                    Read Log →
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </main>

      <footer className="mt-24 border-t border-[var(--border-default)] py-12">
        <div className="max-w-5xl mx-auto px-6 text-center text-[var(--text-muted)] text-xs font-mono uppercase tracking-widest">
          &copy; 2026 Andrie Wijaya // Data Stream: Stable
        </div>
      </footer>
    </div>
  );
}
