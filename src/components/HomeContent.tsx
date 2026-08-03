"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

const NAV_ITEMS = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "proyek", label: "Proyek Pilihan" },
  { id: "faq", label: "Tanya Jawab" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "pengalaman", label: "Pengalaman" },
];

export default function HomeContent({
  preloadedProfile,
}: {
  preloadedProfile: Preloaded<typeof api.profile.get>;
}) {
  const projects = useQuery(api.projects.getFeaturedProjects);
  const profile = usePreloadedQuery(preloadedProfile);
  const [activeId, setActiveId] = useState<string>("ringkasan");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      let currentActive = NAV_ITEMS[0].id;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentActive = item.id;
          }
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 60
      ) {
        currentActive = NAV_ITEMS[NAV_ITEMS.length - 1].id;
      }

      setActiveId(currentActive);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <ul className="flex flex-col gap-4 text-sm font-medium">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveId(item.id);
                          const el = document.getElementById(item.id);
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                            window.history.pushState(null, "", `#${item.id}`);
                          }
                        }}
                        className={`block pl-4 transition-all duration-200 border-l-2 ${
                          isActive
                            ? "border-ink text-ink font-semibold"
                            : "border-transparent text-ink-secondary hover:text-ink hover:border-line"
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Konten Utama (Ringkasan) */}
          <article className="max-w-none">
            <section id="ringkasan" className="scroll-mt-24">
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
            <section id="proyek" className="mt-24 scroll-mt-24">
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
                      slug={project.slug}
                      coverUrl={(project as { coverUrl?: string }).coverUrl}
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

            {/* Pendidikan */}
            <section id="pendidikan" className="mt-24 scroll-mt-24">
              <SectionHeading title="Pendidikan" aside="EDUCATION" />
              <div className="border-b border-line pb-8">
                <div className="flex flex-col md:flex-row justify-between md:items-baseline gap-2 mb-3">
                  <h3 className="text-2xl font-semibold text-ink">
                    {profile?.educationTitle ||
                      "Otodidak & Pembelajaran Berkelanjutan"}
                  </h3>
                  <span className="font-mono text-sm text-ink-muted">
                    {profile?.educationPeriod || "2020 — SEKARANG"}
                  </span>
                </div>
                <p className="text-lg text-ink-secondary leading-relaxed max-w-prose mb-6">
                  {profile?.educationDescription ||
                    "Fokus mendalam pada arsitektur produk, sistem web full-stack, otomatisasi proses bisnis, dan integrasi AI agent untuk menyelesaikan masalah nyata."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-line">
                  <div className="flex flex-col gap-1">
                    <Eyebrow tone="muted">BIDANG FOKUS</Eyebrow>
                    <span className="text-base text-ink font-medium">
                      {profile?.educationFocus ||
                        "Product Thinking & Architecture"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Eyebrow tone="muted">METODE</Eyebrow>
                    <span className="text-base text-ink font-medium">
                      {profile?.educationMethod ||
                        "Project-Driven & First-Principles"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Eyebrow tone="muted">LOKASI</Eyebrow>
                    <span className="text-base text-ink font-medium">
                      {profile?.educationLocation ||
                        "Pontianak, Kalimantan Barat, ID"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Pengalaman */}
            <section id="pengalaman" className="mt-24 scroll-mt-24">
              <SectionHeading title="Pengalaman" aside="EXPERIENCE" />
              <div className="space-y-12">
                <div className="border-b border-line pb-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-baseline gap-2 mb-3">
                    <h3 className="text-2xl font-semibold text-ink">
                      {profile?.experienceTitle ||
                        "Product Thinker & Problem Solver"}
                    </h3>
                    <span className="font-mono text-sm text-ink-muted">
                      {profile?.experiencePeriod || "2022 — SEKARANG"}
                    </span>
                  </div>
                  <p className="text-lg text-ink-secondary leading-relaxed max-w-prose mb-6">
                    {profile?.experienceDescription ||
                      "Menganalisis inefisiensi proses bisnis dunia nyata, merancang alur digital yang efisien, serta membangun solusi perangkat lunak end-to-end dengan dukungan AI agent."}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-line">
                    <div className="flex flex-col gap-1">
                      <Eyebrow tone="muted">PERAN</Eyebrow>
                      <span className="text-base text-ink font-medium">
                        {profile?.experienceRole ||
                          "Independent Developer & Strategist"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Eyebrow tone="muted">KAPABILITAS</Eyebrow>
                      <span className="text-base text-ink font-medium">
                        {profile?.experienceCapabilities ||
                          "Full-Stack Web & AI Agents"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Eyebrow tone="muted">BASIS</Eyebrow>
                      <span className="text-base text-ink font-medium">
                        {profile?.experienceBase || "Pontianak, ID"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
  slug,
  coverUrl,
}: {
  title: string;
  description: string;
  year: string;
  tags: string;
  link?: string;
  slug?: string;
  coverUrl?: string;
}) {
  const hasTarget = Boolean(slug || link);
  const CardContent = (
    <div
      className={`border-b border-line pb-8 group hover:bg-surface transition-colors px-4 -mx-4 h-full ${hasTarget ? "cursor-pointer" : ""}`}
    >
      {coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={`Cover ${title}`}
          className="mb-6 h-40 w-full rounded-sm object-cover"
        />
      )}
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
      {hasTarget && (
        <Eyebrow
          as="div"
          className="mt-4 group-hover:text-ink transition-colors"
        >
          {slug ? "Studi Kasus →" : "View Mission →"}
        </Eyebrow>
      )}
    </div>
  );

  if (slug) {
    return (
      <Link href={`/projects/${slug}`} className="block no-underline">
        {CardContent}
      </Link>
    );
  }

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

