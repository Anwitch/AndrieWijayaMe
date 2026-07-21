import { internalMutation } from "./_generated/server";

const PROFILE_CONTENT = {
  bio: "Halo, aku **Andrie Wijaya**.\n\nAku tertarik pada satu pertanyaan yang muncul di hampir semua industri: kenapa proses ini masih serumit ini? Sebagai mahasiswa Informatika Universitas Tanjungpura, aku mempelajari alur kerja nyata, menemukan di mana orang kehilangan waktu atau informasi, lalu merancang solusi digital yang praktis — mulai dari rekam medis klinik, platform magang, sampai asisten keuangan berbasis AI.",
  tagline: "Merancang solusi dari masalah nyata",
  status: "Terbuka untuk magang & kolaborasi",
  linkedinUrl: "https://www.linkedin.com/in/andrie-wijaya",
  githubUrl: "https://github.com/Anwitch",
};

const DEFAULT_SITE_SETTINGS = {
  key: "global" as const,
  siteName: "Andrie Wijaya",
  seoTitle: "Andrie Wijaya — Merancang Solusi dari Masalah Nyata",
  seoDescription:
    "Aku mendokumentasikan proses memahami masalah dunia nyata, lalu merancang bagaimana teknologi bisa menyelesaikannya. Problem solving, bukan sekadar coding.",
  navAboutLabel: "About",
  navAboutVisible: true,
  navProjectsLabel: "Projects",
  navProjectsVisible: true,
  navWritingLabel: "Writing",
  navWritingVisible: true,
  footerText: "Mission Control: Restricted",
};

const NEW_PROJECTS = [
  {
    title: "PERMATA",
    slug: "permata-diskominfo",
    year: "2025",
    tags: "Laravel",
    description:
      "Platform magang multi-peran untuk Diskominfo — mendigitalkan pendaftaran, validasi berkas, dan monitoring peserta magang yang sebelumnya berjalan manual.",
  },
  {
    title: "Rekam Medis Elektronik",
    slug: "rekam-medis-elektronik-klinik",
    year: "2024",
    tags: "Laravel",
    description:
      "Sistem rekam medis elektronik untuk klinik — kunjungan, riwayat pasien, dan resep tercatat dalam satu alur sehingga pencarian berkas tidak lagi manual.",
  },
];

/**
 * One-off data seed for the SEO/GEO entity plan (Task 7 steps 1-4).
 * Idempotent: safe to run again on dev or prod via
 * `npx convex run seedEntity:applySeoEntityData [--prod]`.
 */
export const applySeoEntityData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const summary: string[] = [];
    const now = Date.now();

    const abcPost = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", "abc"))
      .unique();
    if (abcPost) {
      await ctx.db.delete(abcPost._id);
      summary.push("deleted post 'abc'");
    }

    const profile = await ctx.db.query("profile").first();
    if (profile) {
      await ctx.db.patch(profile._id, { ...PROFILE_CONTENT, updatedAt: now });
      summary.push("updated profile bio/tagline/status/socials");
    } else {
      await ctx.db.insert("profile", {
        ...PROFILE_CONTENT,
        location: "Pontianak, Kalimantan Barat",
        updatedAt: now,
      });
      summary.push("created profile");
    }

    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();
    if (!settings) {
      await ctx.db.insert("siteSettings", {
        ...DEFAULT_SITE_SETTINGS,
        updatedAt: now,
      });
      summary.push("created siteSettings global doc");
    }

    const allProjects = await ctx.db.query("projects").collect();
    const kedut = allProjects.find((project) =>
      project.title.toLowerCase().includes("kedut"),
    );
    if (kedut && !kedut.slug) {
      await ctx.db.patch(kedut._id, {
        slug: "kedut-kemana-duitku",
        updatedAt: now,
      });
      summary.push("set slug on Kedut");
    }

    for (const project of NEW_PROJECTS) {
      const existing = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", project.slug))
        .unique();
      if (!existing) {
        await ctx.db.insert("projects", {
          ...project,
          isFeatured: false,
          isPublished: true,
          createdAt: now,
          updatedAt: now,
        });
        summary.push(`created project '${project.title}'`);
      }
    }

    return summary.length > 0 ? summary : ["nothing to do (already applied)"];
  },
});
