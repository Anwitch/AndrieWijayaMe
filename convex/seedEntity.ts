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

const KEDUT_CASE_STUDY = `## Masalah

Aplikasi pencatat keuangan jarang gagal karena kurang fitur — mereka gagal karena mencatat itu sendiri merepotkan. Buka aplikasi, pilih kategori, isi form: terlalu banyak langkah untuk transaksi sekecil beli bakso. Kebanyakan orang berhenti mencatat sebelum kebiasaannya sempat terbentuk.

## Yang Aku Rancang

Kedut (singkatan dari "Kemana Duitku?") menurunkan friksi pencatatan sampai sedekat mungkin dengan nol:

- **Catat lewat chat.** Kirim pesan seperti "bakso 15k" ke bot Telegram dan transaksi tercatat — tidak perlu membuka aplikasi lain di tengah aktivitas.
- **Parser bahasa natural tiga lapis.** Input diproses bertahap: parser lokal dulu, lalu Gemini AI, dengan fallback terakhir — sehingga "makan 35rb" maupun "gaji 10jt" tetap dipahami dengan biaya API seminimal mungkin.
- **Review sebelum simpan.** AI hanya mengusulkan hasil parsing; tidak ada transaksi yang tersimpan otomatis tanpa konfirmasi pengguna.
- **Dashboard web untuk analisis.** Tren pengeluaran, rincian kategori, gauge progres tabungan, dan insight berbahasa Indonesia yang bisa langsung ditindaklanjuti — misalnya "jajan kopi naik 10%, coba kurangi 2x minggu ini".

## Keputusan Desain

Pencatatan cepat dan analisis mendalam sengaja dipisah ke dua kanal: bot Telegram untuk momen transaksi, dashboard web untuk waktu evaluasi. Satu antarmuka yang mencoba melakukan keduanya biasanya berakhir buruk di keduanya.

## Teknologi

Next.js + Tailwind CSS (web), FastAPI/Python (backend & NLP), Supabase (PostgreSQL + auth), python-telegram-bot, Google Gemini.`;

const REMELO_CASE_STUDY = `## Masalah

Banyak dokter praktik mandiri masih mencatat rekam medis di kertas. Solusi RME yang tersedia umumnya berbasis cloud: berlangganan bulanan, bergantung pada internet stabil, dan data pasien tersimpan di server pihak ketiga — tiga hal yang justru menjadi penghalang bagi praktik kecil.

## Yang Aku Rancang

Remelo (Rekam Medis Elektronik Lokal) adalah aplikasi desktop yang berjalan sepenuhnya offline. Data pasien tersimpan di komputer dokter sendiri, tanpa biaya langganan.

- **Pencatatan SOAP terstruktur** — Subjective, Objective, Assessment, Plan — dengan input tanda vital dan kalkulasi BMI otomatis.
- **ICD-10 offline.** Autocomplete diagnosis dari 18.500+ kode ICD-10 tanpa koneksi internet.
- **Dirancang untuk kecepatan konsultasi.** Navigasi antar field cukup dengan Enter, draft tersimpan otomatis, dan kunjungan pasien kontrol bisa disalin dari kunjungan sebelumnya.
- **Data tetap milik dokter.** Database SQLite lokal, backup terenkripsi AES-256-GCM ke satu file portabel, dan auto-lock sesi saat komputer ditinggal.
- **Dokumen administratif sekali klik.** Resume medis PDF, surat keterangan sakit/sehat, dan kartu pasien.

## Keputusan Desain

Offline-first di sini bukan keterbatasan, melainkan fitur: privasi data medis terjaga karena data tidak pernah meninggalkan komputer praktik, dan aplikasi tetap berfungsi penuh saat internet mati. Versi mobile (Flutter, Android, juga offline) sedang dikembangkan dengan prinsip yang sama.

## Teknologi

Electron, TypeScript, Vite, SQLite.`;

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

/**
 * Case studies drafted from the actual codebases (Kedut, Remelo) plus
 * factual corrections (Remelo stack/year). Idempotent — patches by slug via
 * `npx convex run seedEntity:applyCaseStudies [--prod]`.
 */
export const applyCaseStudies = internalMutation({
  args: {},
  handler: async (ctx) => {
    const summary: string[] = [];
    const now = Date.now();

    const kedut = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", "kedut-kemana-duitku"))
      .unique();
    if (kedut) {
      await ctx.db.patch(kedut._id, {
        caseStudy: KEDUT_CASE_STUDY,
        tags: "Next.js, FastAPI, Supabase, Gemini",
        updatedAt: now,
      });
      summary.push("case study + tags set on Kedut");
    }

    const remelo = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) =>
        q.eq("slug", "rekam-medis-elektronik-klinik"),
      )
      .unique();
    if (remelo) {
      await ctx.db.patch(remelo._id, {
        title: "Remelo (Rekam Medis Elektronik)",
        description:
          "Aplikasi rekam medis elektronik desktop untuk dokter praktik mandiri — berjalan sepenuhnya offline dengan pencatatan SOAP, ICD-10 offline, dan backup terenkripsi.",
        caseStudy: REMELO_CASE_STUDY,
        tags: "Electron, TypeScript, SQLite",
        year: "2026",
        updatedAt: now,
      });
      summary.push("case study + corrected facts set on Remelo");
    }

    return summary.length > 0 ? summary : ["no matching projects found"];
  },
});
