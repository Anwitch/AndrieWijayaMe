"use client";

import Navbar from "@/components/Navbar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function ProjectsArchive() {
  const projects = useQuery(api.projects.getProjects);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16 min-h-screen">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Profile
        </Link>

        <header className="mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)] block mb-4">
            Archive
          </span>
          <h1 className="text-5xl font-bold tracking-tight mb-6 text-[var(--text-primary)]">
            All Missions
          </h1>
          <p className="text-[var(--text-secondary)] text-xl max-w-2xl leading-relaxed">
            A comprehensive log of all projects, experiments, and digital
            builds. Structured for archival reference.
          </p>
        </header>

        <div className="border-t border-[var(--border-default)]">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-[var(--border-default)] font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
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
            <tbody className="divide-y divide-[var(--bg-secondary)]">
              {projects === undefined ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-8 pl-6 pr-8">
                      <div className="h-4 bg-gray-100 w-12" />
                    </td>
                    <td className="py-8">
                      <div className="h-5 bg-gray-100 w-48 mb-3" />
                      <div className="h-4 bg-gray-100 w-full max-w-md" />
                    </td>
                    <td className="py-8 px-8 hidden md:table-cell">
                      <div className="h-4 bg-gray-100 w-24" />
                    </td>
                    <td className="py-8 pl-8 pr-6 text-right">
                      <div className="h-4 bg-gray-100 w-8 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-20 text-center font-mono text-xs text-gray-400 uppercase tracking-widest"
                  >
                    No missions found in the logs.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project._id}
                    className="group hover:bg-[var(--bg-secondary)]/50 transition-colors"
                  >
                    {/* Padding kiri yang sama dengan header */}
                    <td className="py-8 pl-6 pr-8 align-top font-mono text-sm text-[var(--text-muted)] whitespace-nowrap">
                      {project.year}
                    </td>
                    <td className="py-8 align-top">
                      <div className="font-semibold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors leading-none">
                        {project.title}
                      </div>
                      <div className="text-base text-[var(--text-secondary)] mt-4 max-w-xl leading-relaxed">
                        {project.description}
                      </div>
                    </td>
                    <td className="py-8 px-8 align-top hidden md:table-cell">
                      <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis block">
                        {project.tags}
                      </span>
                    </td>
                    {/* Padding kanan yang sama dengan header */}
                    <td className="py-8 pl-8 pr-6 align-top text-right">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                          <span className="text-[10px] font-mono uppercase tracking-widest hidden sm:inline">
                            View
                          </span>
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-[var(--border-strong)]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="mt-24 border-t border-[var(--border-default)] py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-widest">
          &copy; 2026 Andrie Wijaya // Mission Archive Complete
        </div>
      </footer>
    </>
  );
}
