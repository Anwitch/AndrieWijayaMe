"use client";

import Hero from "@/components/Hero";
import MetadataStrip from "@/components/MetadataStrip";
import PublicShell from "@/components/PublicShell";
import FaqSection from "@/components/FaqSection";
import {
  Eyebrow,
  EmptyState,
  MonoLink,
  SectionHeading,
  Skeleton,
} from "@/components/ui";
import { usePreloadedQuery, useQuery } from "convex/react";
import type { Preloaded } from "convex/react";
import { api } from "../../convex/_generated/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function HomeContent({
  preloadedProfile,
}: {
  preloadedProfile: Preloaded<typeof api.profile.get>;
}) {
  const projects = useQuery(api.projects.getFeaturedProjects);
  const profile = usePreloadedQuery(preloadedProfile);

  return (
    <PublicShell>
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <Hero profile={profile} isPublic />
        <MetadataStrip profile={profile} isPublic />

        <hr className="my-12 border-line" />

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-16 items-start">
          {/* Sidebar Navigasi (ISI) */}
          <aside className="hidden md:block sticky top-24 self-start">
            <Eyebrow
              as="h2"
              className="block font-semibold mb-6 border-b border-line pb-2"
            >
              ISI
            </Eyebrow>
            <nav>
              <ul className="flex flex-col gap-4 text-sm font-medium text-ink-secondary">
                <li>
                  <a
                    href="#ringkasan"
                    className="text-ink border-l-2 border-ink pl-4 font-semibold block transition-all hover:pl-5"
                  >
                    Ringkasan
                  </a>
                </li>
                <li>
                  <a
                    href="#proyek"
                    className="hover:text-ink pl-4 transition-all hover:pl-5 block border-l-2 border-transparent hover:border-line"
                  >
                    Proyek Pilihan
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="hover:text-ink pl-4 transition-all hover:pl-5 block border-l-2 border-transparent hover:border-line"
                  >
                    Tanya Jawab
                  </a>
                </li>
                <li className="text-ink-faint pl-4 border-l-2 border-transparent cursor-not-allowed">
                  Pendidikan
                </li>
                <li className="text-ink-faint pl-4 border-l-2 border-transparent cursor-not-allowed">
                  Pengalaman
                </li>
              </ul>
            </nav>
          </aside>

          {/* Konten Utama (Ringkasan) */}
          <article className="max-w-none">
            <section id="ringkasan">
              <SectionHeading title="Ringkasan" />
              <div
                className="prose max-w-none text-lg leading-relaxed text-ink-secondary
                prose-p:mb-6 prose-p:leading-relaxed prose-p:text-ink-secondary
                prose-strong:text-ink prose-strong:font-semibold"
              >
                {profile?.bio ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {profile.bio}
                  </ReactMarkdown>
                ) : (
                  <p>
                    Product thinker dan problem solver yang berbasis di
                    Pontianak. Merancang solusi digital dari masalah nyata,
                    dengan fokus pada otomasi dan AI.
                  </p>
                )}
              </div>
            </section>

            {/* Proyek Pilihan */}
            <section id="proyek" className="mt-24">
              <SectionHeading
                title="Proyek Pilihan"
                aside={`${projects?.length ?? 0} FEATURED MISSIONS`}
              />

              <div className="grid grid-cols-1 gap-10">
                {projects === undefined ? (
                  <div className="animate-pulse flex flex-col gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : projects.length === 0 ? (
                  <EmptyState>No featured missions logged yet.</EmptyState>
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
                <MonoLink href="/projects" className="group">
                  View All Projects{" "}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </MonoLink>
              </div>
            </section>

            <FaqSection />
          </article>
        </div>
      </main>
    </PublicShell>
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
    <div className="border-b border-line pb-8 group cursor-pointer hover:bg-surface transition-colors px-4 -mx-4 h-full">
      <Eyebrow>{tags}</Eyebrow>
      <h3 className="text-2xl font-semibold mt-2 group-hover:text-accent transition-colors flex items-baseline justify-between gap-4">
        <span>{title}</span>
        <span className="text-lg font-normal text-ink-faint tabular-nums">
          ({year})
        </span>
      </h3>
      <p className="mt-3 text-lg leading-relaxed text-ink-secondary line-clamp-2">
        {description}
      </p>
      {link && (
        <Eyebrow
          as="div"
          className="mt-4 group-hover:text-ink transition-colors"
        >
          View Mission →
        </Eyebrow>
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
