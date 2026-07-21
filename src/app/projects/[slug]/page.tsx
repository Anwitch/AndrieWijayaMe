import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import PublicShell from "@/components/PublicShell";
import { Eyebrow, MonoLink } from "@/components/ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-settings.server";
import { SITE_URL } from "@/lib/site-url";
import { breadcrumbSchema } from "@/lib/structured-data";

async function getProject(slug: string) {
  try {
    return await fetchQuery(api.projects.getBySlug, { slug });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return {
      title: "Project Not Found",
      robots: { index: false, follow: false },
    };
  }
  const url = `${SITE_URL}/projects/${slug}`;
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: project.title,
      description: project.description,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProject(slug),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  const url = `${SITE_URL}/projects/${slug}`;
  const breadcrumb = breadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${slug}` },
  ]);
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    datePublished: new Date(project.createdAt).toISOString(),
    dateModified: new Date(
      project.updatedAt ?? project.createdAt,
    ).toISOString(),
    inLanguage: "id-ID",
    url,
    mainEntityOfPage: url,
    image: `${SITE_URL}/opengraph-image`,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    about: { "@type": "SoftwareApplication", name: project.title },
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([article, breadcrumb]),
        }}
      />
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24 animate-fade-in-up">
        <MonoLink href="/projects" className="mb-12 group">
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Archive
        </MonoLink>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Eyebrow tone="accent">{project.year}</Eyebrow>
            {project.tags && (
              <>
                <span className="w-1 h-1 rounded-full bg-line-strong"></span>
                <span className="font-mono text-xs text-ink-muted">
                  {project.tags}
                </span>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-ink leading-tight mb-6">
            {project.title}
          </h1>
          <p className="text-lg text-ink-secondary leading-relaxed mb-8">
            {project.description}
          </p>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-muted hover:text-accent transition-colors"
            >
              Kunjungi Proyek <ExternalLink size={14} />
            </a>
          )}
          <div className="h-1 w-16 bg-ink mt-8" />
        </header>

        {project.caseStudy && (
          <article
            className="prose max-w-none
            prose-headings:text-ink prose-headings:font-semibold
            prose-p:text-ink-secondary prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-ink prose-strong:font-semibold
            prose-code:text-accent prose-code:bg-accent-subtle prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-ink prose-pre:text-paper prose-pre:rounded-sm
            prose-blockquote:border-l-ink prose-blockquote:italic prose-blockquote:text-ink-secondary"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.caseStudy}
            </ReactMarkdown>
          </article>
        )}

        <section className="mt-24 pt-12 border-t border-line">
          <p className="text-sm text-ink-secondary italic">
            Studi kasus dari arsip proyek {settings.siteName}.
          </p>
        </section>
      </main>
    </PublicShell>
  );
}
