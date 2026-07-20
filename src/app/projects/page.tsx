"use client";

import { useEffect } from "react";
import PublicShell from "@/components/PublicShell";
import {
  Button,
  Eyebrow,
  MonoLink,
  PageHeader,
  Skeleton,
} from "@/components/ui";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function ProjectsArchive() {
  const { results: projectResults, status, loadMore } = usePaginatedQuery(
    api.projects.listPublished,
    {},
    { initialNumItems: 50 },
  );
  const projects = projectResults.filter((project) => project !== null);
  const isLoading = status === "LoadingFirstPage";

  useEffect(() => {
    if (projects.length === 0 && status === "CanLoadMore") {
      loadMore(50);
    }
  }, [loadMore, projects.length, status]);

  return (
    <PublicShell>
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 min-h-screen animate-fade-in-up">
        <MonoLink href="/" className="mb-12">
          <ArrowLeft size={14} /> Back to Profile
        </MonoLink>

        <PageHeader
          eyebrow="Archive"
          title="All Missions"
          lede="A comprehensive log of all projects, experiments, and digital builds. Structured for archival reference."
        />

        <div className="border-t border-line">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-line font-mono text-xs uppercase tracking-widest text-ink-muted">
                {/* Memberikan padding kiri (pl-6) pada kolom pertama */}
                <th className="py-6 pl-6 pr-8 font-normal w-[15%]">Year</th>
                <th className="py-6 font-normal w-[45%] md:w-[50%]">
                  Mission Details
                </th>
                <th className="py-6 px-8 font-normal hidden md:table-cell w-[25%]">
                  Built With
                </th>
                {/* Memberikan padding kanan (pr-6) pada kolom terakhir */}
                <th className="py-6 pl-8 pr-6 font-normal text-right w-[15%] md:w-[10%]">
                  Link
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {isLoading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-8 pl-6 pr-8">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="py-8">
                      <Skeleton className="h-5 w-48 mb-3" />
                      <Skeleton className="h-4 w-full max-w-md" />
                    </td>
                    <td className="py-8 px-8 hidden md:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-8 pl-8 pr-6 text-right">
                      <Skeleton className="h-4 w-8 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : projects.length === 0 && status === "Exhausted" ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyRow>No missions found in the logs.</EmptyRow>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyRow>Scanning mission logs...</EmptyRow>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project._id}
                    className="group hover:bg-surface/50 transition-colors"
                  >
                    {/* Padding kiri yang sama dengan header */}
                    <td className="py-8 pl-6 pr-8 align-top font-mono text-sm text-ink-muted whitespace-nowrap">
                      {project.year}
                    </td>
                    <td className="py-8 align-top">
                      <div className="font-semibold text-lg text-ink group-hover:text-accent transition-colors leading-none">
                        {project.title}
                      </div>
                      <div className="text-base text-ink-secondary mt-4 max-w-xl leading-relaxed">
                        {project.description}
                      </div>
                    </td>
                    <td className="py-8 px-8 align-top hidden md:table-cell">
                      <Eyebrow className="whitespace-nowrap overflow-hidden text-ellipsis block">
                        {project.tags}
                      </Eyebrow>
                    </td>
                    {/* Padding kanan yang sama dengan header */}
                    <td className="py-8 pl-8 pr-6 align-top text-right">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-ink-muted hover:text-accent transition-colors"
                        >
                          <span className="text-xs font-mono uppercase tracking-widest hidden sm:inline">
                            View
                          </span>
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-ink-faint">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {status !== "Exhausted" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => loadMore(50)}
            disabled={status === "LoadingMore"}
            className="mt-10 w-full"
          >
            {status === "LoadingMore" ? "Loading Missions..." : "Load More Missions"}
          </Button>
        )}
      </main>
    </PublicShell>
  );
}

function EmptyRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-20 text-center">
      <Eyebrow>{children}</Eyebrow>
    </div>
  );
}
