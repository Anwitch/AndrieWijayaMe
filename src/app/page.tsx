"use client";

import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import MetadataStrip from "@/components/MetadataStrip";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export default function Home() {
  const projects = useQuery(api.projects.getFeaturedProjects);
  const profile = useQuery(api.profile.get);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <Hero isPublic />
        <MetadataStrip isPublic />

        <hr className="my-12 border-gray-200" />

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-16 items-start">
          {/* Sidebar Navigasi (ISI) */}
          <aside className="hidden md:block sticky top-24 self-start">
            <h2 className="font-bold text-sm uppercase tracking-wider mb-6 text-gray-500 border-b border-gray-100 pb-2">
              ISI
            </h2>
            <nav>
              <ul className="flex flex-col gap-4 text-sm font-medium text-gray-700">
                <li>
                  <a
                    href="#ringkasan"
                    className="text-black border-l-2 border-black pl-4 font-semibold block transition-all hover:pl-5"
                  >
                    Ringkasan
                  </a>
                </li>
                <li>
                  <a
                    href="#proyek"
                    className="hover:text-black pl-4 transition-all hover:pl-5 block border-l-2 border-transparent hover:border-gray-200"
                  >
                    Proyek Pilihan
                  </a>
                </li>
                <li className="text-gray-300 pl-4 border-l-2 border-transparent cursor-not-allowed">
                  Pendidikan
                </li>
                <li className="text-gray-300 pl-4 border-l-2 border-transparent cursor-not-allowed">
                  Pengalaman
                </li>
              </ul>
            </nav>
          </aside>

          {/* Konten Utama (Ringkasan) */}
          <article className="max-w-none">
            <section id="ringkasan">
              <h2 className="text-4xl font-bold mb-8">Ringkasan</h2>
              <div
                className="text-gray-800 leading-relaxed text-xl prose prose-slate max-w-none
                prose-p:mb-6 prose-p:leading-relaxed prose-strong:text-black prose-strong:font-bold"
              >
                {profile?.bio ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {profile.bio}
                  </ReactMarkdown>
                ) : (
                  <p>
                    Software Developer yang berbasis di Pontianak. Membangun
                    solusi digital dengan fokus pada otomasi dan AI.
                  </p>
                )}
              </div>
            </section>

            {/* Proyek Pilihan */}
            <section id="proyek" className="mt-24">
              <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
                <h2 className="text-4xl font-bold">Proyek Pilihan</h2>
                <span className="font-mono text-xs text-gray-400 uppercase tracking-widest hidden md:block">
                  {projects?.length ?? 0} FEATURED MISSIONS
                </span>
              </div>

              <div className="grid grid-cols-1 gap-10">
                {projects === undefined ? (
                  <div className="animate-pulse flex flex-col gap-4">
                    <div className="h-4 bg-gray-100 w-24"></div>
                    <div className="h-8 bg-gray-100 w-full"></div>
                    <div className="h-4 bg-gray-100 w-full"></div>
                  </div>
                ) : projects.length === 0 ? (
                  <p className="text-gray-500 font-mono text-sm uppercase tracking-widest py-12 border-y border-dashed border-gray-200 text-center">
                    No featured missions logged yet.
                  </p>
                ) : (
                  projects.map((project) => (
                    <ProjectCardNASA
                      key={project._id}
                      title={project.title}
                      description={project.description}
                      year={project.year}
                      tags={project.tags}
                      link={project.link}
                    />
                  ))
                )}
              </div>

              <div className="mt-16 text-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors group"
                >
                  View All Projects{" "}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>

      <footer className="mt-24 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm font-mono uppercase tracking-widest">
          &copy; 2026 Andrie Wijaya // Mission Control: Restricted
        </div>
      </footer>
    </>
  );
}

function ProjectCardNASA({
  title,
  description,
  year,
  tags,
  link,
}: {
  title: string;
  description: string;
  year: string;
  tags: string;
  link?: string;
}) {
  const CardContent = (
    <div className="border-b border-gray-200 pb-8 group cursor-pointer hover:bg-gray-50 transition-all px-4 -mx-4 h-full">
      <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
        {tags}
      </span>
      <h3 className="text-3xl font-semibold mt-2 group-hover:text-blue-600 transition-colors flex items-baseline justify-between gap-4">
        <span>{title}</span>
        <span className="text-xl font-normal text-gray-300 tabular-nums">
          ({year})
        </span>
      </h3>
      <p className="mt-3 text-gray-600 text-lg leading-relaxed line-clamp-2 group-hover:text-gray-900 transition-colors">
        {description}
      </p>
      {link && (
        <div className="mt-4 text-xs font-mono text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">
          View Mission →
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline"
      >
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
