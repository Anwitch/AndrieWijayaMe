import { internalMutation } from "./_generated/server";

const PROFILE_CONTENT = {
  bio: "Halo, aku **Andrie Wijaya**.\n\nAku tertarik pada satu pertanyaan yang muncul di hampir semua industri: kenapa proses ini masih serumit ini? Sebagai mahasiswa Informatika Universitas Tanjungpura, aku mempelajari alur kerja nyata, menemukan di mana orang kehilangan waktu atau informasi, lalu merancang solusi digital yang praktis — mulai dari rekam medis klinik, platform magang, sampai asisten keuangan berbasis AI.",
  tagline: "Merancang solusi dari masalah nyata",
  status: "Terbuka untuk magang & kolaborasi",
  educationTitle: "Informatika / Otodidak & Pembelajaran Berkelanjutan",
  educationPeriod: "2020 — SEKARANG",
  educationDescription: "Fokus mendalam pada arsitektur produk, sistem web full-stack, otomatisasi proses bisnis, dan integrasi AI agent untuk menyelesaikan masalah nyata.",
  educationFocus: "Product Thinking & Architecture",
  educationMethod: "Project-Driven & First-Principles",
  educationLocation: "Pontianak, Kalimantan Barat, ID",
  experienceTitle: "Product Thinker & Problem Solver",
  experiencePeriod: "2022 — SEKARANG",
  experienceDescription: "Menganalisis inefisiensi proses bisnis dunia nyata, merancang alur digital yang efisien, serta membangun solusi perangkat lunak end-to-end dengan dukungan AI agent.",
  experienceRole: "Independent Developer & Strategist",
  experienceCapabilities: "Full-Stack Web & AI Agents",
  experienceBase: "Pontianak, ID",
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

const CONVEX_VS_FIREBASE_CONTENT = `Building modern full-stack web applications with Next.js requires a backend architecture that can deliver fast initial renders, seamless client-side state synchronization, and strict type safety.

For years, Firebase (and Firestore in particular) was the default choice for developers seeking a serverless, real-time database. However, as web application patterns evolved—especially with React Server Components (RSC) and strict TypeScript workflows—the friction points of traditional document databases became increasingly apparent.

In our recent projects, we shifted our primary backend stack to **Convex**. Below is an in-depth technical analysis comparing Convex and Firebase across four critical engineering dimensions: type safety, reactivity, transactional integrity, and developer ergonomics.

---

## 1. End-to-End Type Safety & DX

### Firebase
In Firestore, data validation and schema definitions are decoupled from the code consuming it. Type safety is typically maintained through manual TypeScript interfaces and runtime casting:

\`\`\`typescript
// Firestore client code: manual casting & untyped queries
const docRef = doc(db, "projects", projectId);
const snapshot = await getDoc(docRef);
const data = snapshot.data() as ProjectData; // Unsafe runtime assertion
\`\`\`

Security rules and data validation are written in Firebase's proprietary Domain Specific Language (DSL):

\`\`\`cel
// Firestore security rules (separate file, separate paradigm)
match /projects/{projectId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == resource.data.ownerId;
}
\`\`\`

This creates a cognitive tax: backend security logic, frontend type definitions, and database indexes exist in three distinct formats and locations.

### Convex
Convex treats TypeScript as a first-class primitive. Schemas are defined centrally in \`convex/schema.ts\` using runtime validators that automatically generate strict TypeScript types across the entire application:

\`\`\`typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    ownerId: v.string(),
    isPublished: v.boolean(),
  }).index("by_owner", ["ownerId"]),
});
\`\`\`

Querying functions are completely typed end-to-end without manual type annotations or code generation CLI steps:

\`\`\`typescript
// Next.js component: 100% type-safe reactive query
const projects = useQuery(api.projects.listByOwner, { ownerId: user.id });
\`\`\`

If a table schema changes, TypeScript immediately surfaces type errors across both server and client code during build time.

---

## 2. Reactive State & Subscriptions

Both platforms support real-time data streaming, but their underlying architectures differ fundamentally.

### Firebase Firestore
Firestore uses snapshot listeners (\`onSnapshot\`). While powerful, developers must manually attach listeners, manage unsubscribe cleanup logic, and handle local cache reconciliation:

- **State Drift:** If multiple components subscribe to different sub-collections, coordinating state across the tree requires complex client-side global state stores (Zustand/Redux).
- **Read Amplification:** Unoptimized snapshot listeners can quickly amplify document read counts, leading to unexpected billing spikes.

### Convex
Convex redefines reactivity by making every query function reactive by default:

\`\`\`typescript
// convex/projects.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByOwner = query({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
  },
});
\`\`\`

When a component calls \`useQuery(api.projects.listByOwner, ...)\`:
1. Convex automatically tracks which database documents were read during execution.
2. If any of those specific documents are modified by a mutation, Convex automatically reruns the query on the server and pushes only the delta to subscribed clients.
3. No manual cache invalidation or listener lifecycle management is required.

---

## 3. ACID Transactions vs. Optimistic Locks

### Firebase
Firestore operations are split across client SDK calls, Security Rules, and Cloud Functions (Node.js). 

- Complex multi-document writes often require Firestore Transactions or Batched Writes.
- Server-side business logic running in Firebase Cloud Functions suffers from cold starts and asynchronous execution delays.
- Race conditions during concurrent updates must be explicitly mitigated by developers using optimistic concurrency controls.

### Convex
All Convex mutations execute as **deterministic, isolated ACID transactions** in a fast V8 execution environment:

\`\`\`typescript
// convex/projects.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const publishProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");
    
    // Atomic update guarantee
    await ctx.db.patch(args.projectId, { isPublished: true, updatedAt: Date.now() });
  },
});
\`\`\`

If two mutations attempt to modify the same document concurrently, Convex handles Optimistic Concurrency Control (OCC) automatically behind the scenes—retrying the transaction transparently without leaving the database in an inconsistent state.

---

## 4. Next.js App Router & SSR Ergonomics

Integrating Firebase with Next.js App Router (React Server Components) requires navigating complex authentication token handshakes between client SDKs and server-side Admin SDKs (\`firebase-admin\`).

Convex provides official integration packages (\`convex/nextjs\`) that allow seamless data fetching across both Server Components and Client Components:

\`\`\`typescript
// Server Component (RSC) pre-fetching
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function ProjectsPage() {
  // Pre-rendered on the server with zero client waterfall
  const posts = await fetchQuery(api.posts.listPublished, {});
  
  return <ProjectsList initialData={posts} />;
}
\`\`\`

---

## Architecture Comparison Matrix

| Feature | Firebase (Firestore) | Convex |
| :--- | :--- | :--- |
| **Type Safety** | Manual casting (\`as Type\`) | End-to-end inference from schema |
| **Business Logic** | Split: Security Rules + Cloud Functions | Pure TypeScript Server Functions |
| **Reactivity** | Snapshot listeners (\`onSnapshot\`) | Automatic Reactive Queries (\`useQuery\`) |
| **Transactions** | Explicit transaction objects | All mutations are ACID transactions |
| **Next.js RSC Support** | Complex (Admin SDK vs Client SDK) | Native (\`fetchQuery\` & \`preloadQuery\`) |
| **Local DX / Emulators** | Java-based Firebase Suite | Lightweight local runner (\`npx convex dev\`) |

---

## Conclusion

Firebase remains a solid platform for mobile-first apps requiring offline persistence out of the box. However, for modern web applications built on Next.js, React Server Components, and TypeScript, **Convex delivers a dramatically superior developer experience, bulletproof type safety, and zero-maintenance reactivity.**

By eliminating the gap between database logic, security rules, and frontend state, Convex allows engineering teams to ship reliable, high-performance web products in a fraction of the time.`;

const CONVEX_VS_FIREBASE_CONTENT_ID = `Membangun aplikasi web full-stack modern dengan Next.js memerlukan arsitektur backend yang mampu memberikan performa render awal yang cepat, sinkronisasi state client-side tanpa hambatan, serta type safety yang ketat.

Selama bertahun-tahun, Firebase (khususnya Firestore) menjadi pilihan utama bagi para pengembang yang membutuhkan database real-time serverless. Namun, seiring berkembangnya pola aplikasi web—terutama dengan hadirnya React Server Components (RSC) dan alur kerja TypeScript yang ketat—berbagai hambatan arsitektural pada database dokumen tradisional mulai terasa.

Dalam proyek-proyek terbaru kami, kami mengalihkan stack backend utama kami ke **Convex**. Berikut adalah analisis teknis mendalam yang membandingkan Convex dan Firebase pada empat dimensi rekayasa utama: type safety, reaktivitas, integritas transaksi, dan ergonomi pengembang.

---

## 1. End-to-End Type Safety & DX

### Firebase
Di Firestore, validasi data dan definisi skema terpisah dari kode aplikasi. Type safety umumnya dikelola secara manual melalui interface TypeScript dan runtime casting:

\`\`\`typescript
// Kode client Firestore: casting manual & query tanpa tipe
const docRef = doc(db, "projects", projectId);
const snapshot = await getDoc(docRef);
const data = snapshot.data() as ProjectData; // Asersi tipe yang berisiko
\`\`\`

Aturan keamanan (Security Rules) dan validasi data ditulis dalam Domain Specific Language (DSL) milik Firebase yang terpisah:

\`\`\`cel
// Security rules Firestore (berkas terpisah, paradigma berbeda)
match /projects/{projectId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == resource.data.ownerId;
}
\`\`\`

Hal ini menciptakan beban kognitif: logika keamanan backend, definisi tipe frontend, dan indeks database berada di tiga format dan tempat terpisah.

### Convex
Convex memperlakukan TypeScript sebagai komponen utama. Skema didefinisikan secara tersentralisasi di \`convex/schema.ts\` menggunakan validator runtime yang secara otomatis menghasilkan tipe TypeScript yang ketat untuk seluruh aplikasi:

\`\`\`typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    ownerId: v.string(),
    isPublished: v.boolean(),
  }).index("by_owner", ["ownerId"]),
});
\`\`\`

Query ditulis dengan type safety 100% tanpa perlu konfigurasi CLI pembuat tipe tambahan:

\`\`\`typescript
// Komponen Next.js: query reaktif yang 100% type-safe
const projects = useQuery(api.projects.listByOwner, { ownerId: user.id });
\`\`\`

Jika terjadi perubahan pada skema tabel, TypeScript akan langsung mendeteksi error pada server maupun client saat proses build.

---

## 2. Realtime State & Subscriptions

Kedua platform mendukung streaming data real-time, tetapi arsitektur dasarnya berbeda secara fundamental.

### Firebase Firestore
Firestore menggunakan snapshot listener (\`onSnapshot\`). Meskipun canggih, pengembang harus mengelola siklus hidup listener, proses unsubscribe, serta rekonsiliasi cache lokal secara manual:

- **State Drift:** Jika beberapa komponen berlangganan sub-koleksi yang berbeda, mengoordinasikan state antar komponen memerlukan store global seperti Zustand/Redux.
- **Read Amplification:** Snapshot listener yang tidak dioptimalkan dapat membengkakkan jumlah pembacaan dokumen dengan cepat, berisiko menyebabkan lonjakan biaya.

### Convex
Convex merevolusi reaktivitas dengan menjadikan setiap query reaktif secara default:

\`\`\`typescript
// convex/projects.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByOwner = query({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
  },
});
\`\`\`

Ketika komponen memanggil \`useQuery(api.projects.listByOwner, ...)\`:
1. Convex secara otomatis mencatat dokumen database mana saja yang dibaca selama eksekusi query.
2. Jika ada dokumen terkait yang diubah oleh transaksi mutation, Convex secara otomatis menjalankan ulang query di server dan hanya mengirimkan perubahan (*delta*) ke client.
3. Tidak ada invalidasi cache manual atau manajemen siklus hidup listener yang diperlukan.

---

## 3. Transaksi ACID vs. Optimistic Locks

### Firebase
Operasi Firestore terbagi di antara Client SDK, Security Rules, dan Cloud Functions (Node.js). 

- Operasi multi-dokumen kompleks memerlukan Firestore Transactions atau Batched Writes.
- Logika bisnis server-side yang berjalan di Firebase Cloud Functions mengalami *cold starts* dan penundaan eksekusi asinkron.

### Convex
Semua mutation pada Convex dieksekusi sebagai **transaksi ACID yang terisolasi dan deterministik** dalam lingkungan V8 yang sangat cepat:

\`\`\`typescript
// convex/projects.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const publishProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project tidak ditemukan");
    
    // Jaminan pembaruan atomis
    await ctx.db.patch(args.projectId, { isPublished: true, updatedAt: Date.now() });
  },
});
\`\`\`

Jika dua mutation mencoba mengubah dokumen yang sama secara bersamaan, Convex menangani Optimistic Concurrency Control (OCC) secara otomatis di balik layar—mengulangi transaksi secara transparan tanpa meninggalkan kondisi database yang inkonsisten.

---

## 4. Next.js App Router & SSR Ergonomics

Mengintegrasikan Firebase dengan Next.js App Router (React Server Components) memerlukan pengelolaan token autentikasi antara Client SDK dan Server Admin SDK (\`firebase-admin\`).

Convex menyediakan integrasi resmi (\`convex/nextjs\`) yang memungkinkan pengambilan data tanpa hambatan baik di Server Component maupun Client Component:

\`\`\`typescript
// Pre-fetching pada Server Component (RSC)
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function ProjectsPage() {
  // Dihasilkan di server tanpa waterfall pada client
  const posts = await fetchQuery(api.posts.listPublished, {});
  
  return <ProjectsList initialData={posts} />;
}
\`\`\`

---

## Matriks Perbandingan Arsitektur

| Fitur | Firebase (Firestore) | Convex |
| :--- | :--- | :--- |
| **Type Safety** | Casting manual (\`as Type\`) | Inferensi otomatis dari skema |
| **Logika Bisnis** | Terpisah: Security Rules + Cloud Functions | Murni TypeScript Server Functions |
| **Reaktivitas** | Snapshot listeners (\`onSnapshot\`) | Query Reaktif Otomatis (\`useQuery\`) |
| **Transaksi** | Objek transaksi eksplisit | Semua mutation adalah transaksi ACID |
| **Dukungan Next.js RSC** | Kompleks (Admin SDK vs Client SDK) | Native (\`fetchQuery\` & \`preloadQuery\`) |
| **Developer Experience** | Firebase Emulator Suite (Java) | Local runner ringan (\`npx convex dev\`) |

---

## Kesimpulan

Firebase tetap menjadi platform yang tangguh untuk aplikasi berbasis mobile yang membutuhkan penyimpanan offline out-of-the-box. Namun, untuk aplikasi web modern yang dibangun di atas Next.js, React Server Components, dan TypeScript, **Convex menghadirkan developer experience yang jauh lebih unggul, type safety yang andal, dan reaktivitas tanpa beban pemeliharaan.**`;

/**
 * Idempotent seed for the "Convex vs Firebase" technical article with dual EN/ID support.
 * Can be run via `npx convex run seedEntity:applyConvexVsFirebaseArticle [--prod]`.
 */
export const applyConvexVsFirebaseArticle = internalMutation({
  args: {},
  handler: async (ctx) => {
    const slug = "convex-vs-firebase-nextjs";
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    const now = Date.now();
    const postData = {
      title: "Why We Chose Convex Over Firebase for Modern Next.js Applications",
      slug,
      content: CONVEX_VS_FIREBASE_CONTENT,
      excerpt:
        "A technical breakdown of reactive state management, end-to-end TypeScript safety, ACID transactions, and developer ergonomics when building full-stack web applications with Next.js.",
      titleId: "Mengapa Kami Memilih Convex Dibandingkan Firebase untuk Aplikasi Next.js Modern",
      excerptId:
        "Analisis teknis tentang manajemen state reaktif, type safety TypeScript end-to-end, transaksi ACID, dan ergonomi pengembang saat membangun aplikasi web full-stack dengan Next.js.",
      contentId: CONVEX_VS_FIREBASE_CONTENT_ID,
      category: "Architecture",
      isPublished: true,
      publishedAt: now,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, postData);
      return `Updated post '${slug}' (${existing._id})`;
    } else {
      const id = await ctx.db.insert("posts", { ...postData, createdAt: now });
      return `Inserted post '${slug}' (${id})`;
    }
  },
});


