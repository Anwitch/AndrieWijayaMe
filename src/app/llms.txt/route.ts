import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { getSiteSettings } from "@/lib/site-settings.server";
import { getProfile } from "@/lib/profile.server";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 3600;

/**
 * llms.txt — ringkasan situs untuk crawler AI (llmstxt.org). Answer-first,
 * padat entitas, tanpa markup berat, agar mudah diekstrak dan dikutip.
 */
export async function GET() {
  const [settings, profile] = await Promise.all([
    getSiteSettings(),
    getProfile(),
  ]);

  let postLines = "";
  try {
    const posts = await fetchQuery(api.posts.listPublished, {
      paginationOpts: { numItems: 50, cursor: null },
    });
    postLines = posts.page
      .map(
        (post) =>
          `- [${post.title}](${SITE_URL}/writing/${post.slug}): ${post.excerpt}`,
      )
      .join("\n");
  } catch {
    // Convex unreachable — section stays empty.
  }

  let projectLines = "";
  try {
    const projects = await fetchQuery(api.projects.listPublished, {
      paginationOpts: { numItems: 50, cursor: null },
    });
    projectLines = projects.page
      .filter((project) => project !== null)
      .map((project) =>
        project.slug
          ? `- [${project.title}](${SITE_URL}/projects/${project.slug}): ${project.description}`
          : `- ${project.title}: ${project.description}`,
      )
      .join("\n");
  } catch {
    // Convex unreachable — section stays empty.
  }

  const socials = [
    profile?.linkedinUrl,
    profile?.githubUrl,
    profile?.xUrl,
    profile?.instagramUrl,
  ]
    .filter((url): url is string => Boolean(url))
    .map((url) => `- ${url}`)
    .join("\n");

  const body = `# ${settings.siteName}

> ${settings.seoDescription}

${settings.siteName} (alias Anwitch) adalah product thinker dan problem solver yang berbasis di Pontianak, Kalimantan Barat, Indonesia — mahasiswa Informatika Universitas Tanjungpura. Ia merancang solusi digital dari masalah dunia nyata: transformasi digital, otomasi proses bisnis, dan pemanfaatan AI.

## Halaman Utama

- [Tentang](${SITE_URL}/about): Profil, cara berpikir, dan cara kerja
- [Projects](${SITE_URL}/projects): Arsip proyek dan studi kasus
- [Writing](${SITE_URL}/writing): Tulisan dan catatan proses

## Proyek

${projectLines || "- (belum ada)"}

## Tulisan

${postLines || "- (belum ada)"}

## Profil Lain

${socials || "- (lihat situs)"}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
