# 📓 The Digital Journal of Andrie Wijaya

> A high-performance personal portfolio and integrated CMS — built to showcase professional work and technical thinking through a minimalist, self-owned digital space.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Convex-Database-orange?logo=convex)](https://convex.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-components-black)](https://ui.shadcn.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [Cost Breakdown](#-cost-breakdown)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 Overview

**The Digital Journal of Andrie Wijaya** adalah platform web personal yang menggabungkan profil profesional dengan sistem manajemen konten (CMS) kustom. Terinspirasi dari estetika minimalis dan fungsional, website ini dirancang untuk:

1. Menampilkan narasi karier dan portofolio proyek secara dinamis.
2. Menjadi wadah pemikiran teknis melalui fitur blog terintegrasi.
3. Memberikan kendali penuh atas konten tanpa bergantung pada platform pihak ketiga.

Seluruh stack dipilih dengan mempertimbangkan **biaya $0/bulan** pada kondisi penggunaan normal (portfolio/blog pribadi).

---

## ✨ Features

### 🌍 Public Side

| Fitur | Deskripsi |
|---|---|
| **Hero Section** | Animasi minimalis dengan intro profesional dan CTA |
| **About Page** | Narasi karier, foto, dan ringkasan keahlian |
| **Project Portfolio** | Daftar proyek dengan filter teknologi, link GitHub & live demo |
| **Blog** | Daftar artikel dengan filter tag/kategori dan search |
| **Blog Detail** | Reading time estimator, syntax highlighting untuk kode, related posts |
| **RSS Feed** | Auto-generated `/feed.xml` untuk pembaca teknis |
| **OG Image Otomatis** | Dynamic Open Graph image per artikel via `@vercel/og` |
| **SEO Optimization** | Meta title & description per halaman, structured data (JSON-LD) |
| **Responsive Design** | Dioptimalkan untuk desktop, tablet, dan mobile |

### 🛠️ CMS Dashboard (Admin Only)

| Fitur | Deskripsi |
|---|---|
| **Autentikasi Aman** | Login email/password melalui Convex Auth, dibatasi ke email pemilik |
| **Rich Text Editor** | Editor Tiptap dengan toolbar lengkap (heading, bold, italic, list, kode) |
| **Draft / Published** | Status artikel: `draft` untuk tulisan belum selesai, `published` untuk publik |
| **Upload Gambar** | Upload cover image via Cloudinary widget langsung dari dashboard |
| **SEO Fields** | Form untuk mengisi meta title, meta description, dan custom OG image per artikel |
| **Slug Generator** | Auto-generate URL-friendly slug dari judul artikel |
| **Preview Mode** | Preview tampilan artikel sebelum dipublish |
| **Tag Management** | Tambah dan kelola tag artikel dari dashboard |

---

## 🧰 Tech Stack

### Core Framework

| Teknologi | Versi | Kegunaan |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15 (App Router) | Framework utama — SSR, SEO, routing |
| [React](https://react.dev/) | 19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type safety end-to-end |

### Backend & Database

| Teknologi | Kegunaan | Free Tier |
|---|---|---|
| [Convex](https://convex.dev/) | Reactive database & backend functions | ✅ Perpetual free tier |
| [Convex Auth](https://labs.convex.dev/auth) | Autentikasi dan sesi CMS | ✅ Terintegrasi dengan Convex |

### Styling & UI

| Teknologi | Kegunaan |
|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Komponen UI yang accessible dan modern |
| [Tiptap](https://tiptap.dev/) | Rich text editor untuk CMS dashboard |
| [Lucide React](https://lucide.dev/) | Icon library |

### Media & Content

| Teknologi | Kegunaan | Free Tier |
|---|---|---|
| [Cloudinary](https://cloudinary.com/) | Upload & hosting gambar | ✅ 25 GB storage gratis |
| [`@vercel/og`](https://vercel.com/docs/functions/og-image-generation) | Dynamic OG image generation | ✅ Gratis di Vercel Hobby |

### Deployment & Hosting

| Teknologi | Kegunaan | Free Tier |
|---|---|---|
| [Vercel](https://vercel.com/) | Hosting Next.js (Hobby Plan) | ✅ 100 GB bandwidth/bulan |

---

## 📁 Project Structure

```
digital-journal/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Route group - halaman publik
│   │   ├── page.tsx              # Homepage / Hero
│   │   ├── about/
│   │   │   └── page.tsx          # Halaman About
│   │   ├── projects/
│   │   │   └── page.tsx          # Halaman Portfolio Proyek
│   │   ├── blog/
│   │   │   ├── page.tsx          # Daftar semua artikel
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Detail artikel
│   │   └── feed.xml/
│   │       └── route.ts          # RSS Feed endpoint
│   ├── (dashboard)/              # Route group - CMS Dashboard
│   │   └── dashboard/
│   │       ├── layout.tsx        # Layout dashboard (auth-protected)
│   │       ├── page.tsx          # Dashboard home / statistik
│   │       └── posts/
│   │           ├── page.tsx      # Daftar artikel di dashboard
│   │           ├── new/
│   │           │   └── page.tsx  # Form buat artikel baru
│   │           └── [id]/
│   │               └── page.tsx  # Form edit artikel
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth.js handler
│   │   └── og/
│   │       └── route.tsx         # Dynamic OG image generator
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # Komponen React yang dapat digunakan ulang
│   ├── ui/                       # shadcn/ui base components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── BlogList.tsx
│   │   ├── TagFilter.tsx
│   │   └── TableOfContents.tsx
│   ├── dashboard/
│   │   ├── Editor.tsx            # Tiptap rich text editor
│   │   ├── ImageUpload.tsx       # Cloudinary upload widget
│   │   └── PostForm.tsx          # Form artikel (new & edit)
│   └── home/
│       ├── Hero.tsx
│       └── FeaturedPosts.tsx
│
├── convex/                       # Convex backend
│   ├── _generated/               # Auto-generated (jangan edit manual)
│   ├── schema.ts                 # Definisi skema database
│   ├── posts.ts                  # Queries & mutations untuk posts
│   └── projects.ts               # Queries & mutations untuk projects
│
├── lib/                          # Utilities & helpers
│   ├── auth.ts                   # Konfigurasi NextAuth.js
│   ├── cloudinary.ts             # Konfigurasi Cloudinary
│   ├── utils.ts                  # Helper functions (cn, formatDate, dll)
│   ├── reading-time.ts           # Kalkulasi reading time
│   └── rss.ts                    # RSS Feed generator
│
├── types/                        # TypeScript type definitions
│   ├── post.ts
│   └── project.ts
│
├── public/                       # Static assets
│   ├── favicon.ico
│   └── images/
│
├── .env.local                    # Environment variables (tidak di-commit)
├── .env.example                  # Template environment variables
├── convex.json                   # Konfigurasi Convex
├── next.config.ts                # Konfigurasi Next.js
├── tailwind.config.ts            # Konfigurasi Tailwind CSS
├── components.json               # Konfigurasi shadcn/ui
├── tsconfig.json                 # Konfigurasi TypeScript
└── package.json
```

---

## 🗄️ Database Schema

Database dikelola oleh **Convex**. Berikut adalah skema lengkapnya (`convex/schema.ts`):

### Table: `posts`

```typescript
posts: defineTable({
  // Konten utama
  title:          v.string(),          // Judul artikel
  slug:           v.string(),          // URL-friendly identifier (unique)
  content:        v.string(),          // HTML dari Tiptap editor
  excerpt:        v.string(),          // Ringkasan singkat (maks 160 karakter)

  // Media
  coverImage:     v.optional(v.string()), // Cloudinary URL

  // Kategorisasi
  tags:           v.array(v.string()),    // ["nextjs", "typescript", "convex"]

  // Status
  status:         v.union(
                    v.literal("draft"),
                    v.literal("published")
                  ),
  publishedAt:    v.optional(v.number()), // Unix timestamp (ms)

  // SEO
  seoTitle:       v.optional(v.string()),
  seoDescription: v.optional(v.string()),
  ogImage:        v.optional(v.string()), // Custom OG image URL (opsional)
})
  .index("by_slug", ["slug"])
  .index("by_status", ["status"])
  .index("by_status_and_publishedAt", ["status", "publishedAt"])
```

### Table: `projects`

```typescript
projects: defineTable({
  // Informasi proyek
  title:          v.string(),
  description:    v.string(),
  longDescription: v.optional(v.string()),  // Deskripsi panjang (opsional)
  coverImage:     v.optional(v.string()),   // Cloudinary URL

  // Links
  githubUrl:      v.optional(v.string()),
  liveUrl:        v.optional(v.string()),

  // Metadata
  techStack:      v.array(v.string()),      // ["Next.js", "Convex", "TypeScript"]
  featured:       v.boolean(),              // Tampil di homepage?
  order:          v.number(),               // Urutan tampil

  // Status
  status:         v.union(
                    v.literal("active"),
                    v.literal("archived"),
                    v.literal("wip")
                  ),
})
  .index("by_featured", ["featured"])
  .index("by_order", ["order"])
```

---

## 🚀 Getting Started

### Prerequisites

Pastikan sudah terinstall:

- **Node.js** `>= 18.17.0`
- **npm** `>= 9.0.0` atau **pnpm** `>= 8.0.0`
- Akun gratis di: [Convex](https://convex.dev), [Cloudinary](https://cloudinary.com), [Vercel](https://vercel.com)

### Installation

**1. Clone repository**

```bash
git clone https://github.com/andriewijaya/digital-journal.git
cd digital-journal
```

**2. Install dependencies**

```bash
npm install
# atau
pnpm install
```

**3. Setup Convex**

```bash
npx convex dev
```

Ikuti instruksi di terminal — Convex akan membuatkan project baru dan mengisi `NEXT_PUBLIC_CONVEX_URL` secara otomatis di `.env.local`.

**4. Konfigurasi Environment Variables**

Salin file template dan isi nilainya:

```bash
cp .env.example .env.local
```

Lihat bagian [Environment Variables](#-environment-variables) untuk detail setiap variabel.

**5. Push skema database ke Convex**

```bash
npx convex dev
```

Convex akan otomatis mendeteksi dan mendeploy skema dari `convex/schema.ts`.

**6. Jalankan development server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

Dashboard CMS dapat diakses di [http://localhost:3000/thisisandwitch](http://localhost:3000/thisisandwitch).

---

## 🔐 Environment Variables

Buat file `.env.local` di root project. **Jangan pernah commit file ini ke Git.**

```env
# =============================================================================
# CONVEX
# =============================================================================
# Didapat otomatis saat menjalankan `npx convex dev`
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOY_KEY=prod:your-deploy-key  # Hanya untuk production deployment

# URL publik deployment Convex production untuk frontend production
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-project.convex.site

# =============================================================================
# CLOUDINARY - Penyimpanan Media
# =============================================================================
# Didapat dari: https://cloudinary.com/console
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=digital-journal-uploads  # Preset unsigned
```

### Cara Mendapatkan Setiap Credential

| Variabel | Cara Mendapatkan |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Otomatis saat `npx convex dev` |
| `CLOUDINARY_*` | [cloudinary.com/console](https://cloudinary.com/console) → Settings → API Keys |

### Environment Autentikasi Convex

Variabel berikut disimpan di deployment Convex, bukan di `.env.local` frontend:

```bash
npx convex env set ADMIN_EMAIL admin@example.com
npx convex env set ADMIN_SETUP_SECRET generated-one-time-secret

npx convex env set --prod SITE_URL https://your-domain.com
npx convex env set --prod ADMIN_EMAIL admin@example.com
npx convex env set --prod ADMIN_SETUP_SECRET generated-one-time-secret
```

Jalankan `npx @convex-dev/auth --prod` untuk membuat key production. Setelah akun admin selesai dibuat pada deployment terkait, hapus setup secret dengan `npx convex env remove ADMIN_SETUP_SECRET` atau tambahkan `--prod` untuk production.

---

## 👨‍💻 Development Guide

### Menjalankan Convex & Next.js Bersamaan

Buka **dua terminal** secara bersamaan:

```bash
# Terminal 1 — Convex dev server (real-time sync)
npx convex dev

# Terminal 2 — Next.js dev server
npm run dev
```

### Membuat Artikel Baru via Dashboard

1. Buka `/thisisandwitch` dan login dengan akun admin Convex Auth
2. Klik **"New Post"**
3. Isi judul, konten via editor Tiptap, dan metadata SEO
4. Upload cover image (akan otomatis ter-upload ke Cloudinary)
5. Atur status ke `published` atau simpan sebagai `draft`
6. Klik **"Save"**

Artikel akan langsung tersedia secara real-time tanpa perlu rebuild.

### Menambahkan Proyek Baru

Edit data proyek langsung melalui Mission Control di `/thisisandwitch` atau via Convex dashboard di `https://dashboard.convex.dev`.

### Kustomisasi Tampilan

- **Warna & Font**: Edit `app/globals.css` dan `tailwind.config.ts`
- **Komponen UI**: Semua base component ada di `components/ui/` (powered by shadcn/ui)
- **Layout**: Edit `components/layout/Navbar.tsx` dan `Footer.tsx`

### Menambahkan shadcn/ui Component Baru

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
# dst.
```

### Scripts yang Tersedia

```bash
npm run dev          # Development server (port 3000)
npm run build        # Build production
npm run start        # Jalankan production build
npm run lint         # ESLint check
npm run type-check   # TypeScript type checking
```

---

## 🚢 Deployment

### Self-host di VPS dengan Docker

Siapkan `.env` di server berdasarkan `.env.example`, lalu jalankan:

```bash
docker compose up -d --build
docker compose ps
```

Container hanya membuka port `3001` di localhost. Gunakan reverse proxy Caddy:

```caddyfile
anwitch.me, www.anwitch.me {
    reverse_proxy localhost:3001
}
```

Jalankan `sudo caddy validate --config /etc/caddy/Caddyfile` sebelum reload konfigurasi.

### Deploy ke Vercel (Recommended)

**Opsi 1 — Via Vercel CLI:**

```bash
npm install -g vercel
vercel
```

**Opsi 2 — Via GitHub (Recommended):**

1. Push repository ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new)
3. Import repository GitHub kamu
4. Tambahkan semua environment variables dari `.env.local`
5. Klik **Deploy**

### Deploy Convex ke Production

```bash
npx convex deploy
```

Pastikan `CONVEX_DEPLOY_KEY` sudah diset di environment variables Vercel.

### Checklist Sebelum Go-Live

- [ ] Semua environment variables sudah diisi di Vercel dashboard
- [ ] `NEXTAUTH_URL` sudah diubah ke URL production (bukan `localhost`)
- [ ] `ADMIN_PASSWORD` menggunakan password yang kuat
- [ ] Cloudinary upload preset sudah dikonfigurasi sebagai "unsigned"
- [ ] Test login ke `/dashboard` di environment production
- [ ] Test buat artikel baru dan pastikan muncul di `/blog`
- [ ] Test RSS Feed di `/feed.xml`
- [ ] Verifikasi OG Image di [opengraph.xyz](https://www.opengraph.xyz/)
- [ ] Pastikan semua link media/gambar menggunakan Cloudinary URL
- [ ] Tambahkan domain kustom di Vercel (opsional)

---

## 💰 Cost Breakdown

Semua layanan yang digunakan memiliki free tier yang **lebih dari cukup** untuk kebutuhan portfolio/blog pribadi.

| Layanan | Paket | Batas Free | Estimasi Penggunaan | Biaya |
|---|---|---|---|---|
| **Vercel** | Hobby | 100 GB bandwidth/bulan | ~1–5 GB/bulan | **$0** |
| **Convex** | Free | 1 juta function calls/bulan | ~10K–50K/bulan | **$0** |
| **NextAuth.js** | Self-hosted | Unlimited | — | **$0** |
| **Cloudinary** | Free | 25 GB storage | ~1–3 GB | **$0** |
| **`@vercel/og`** | Included | Included di Hobby | — | **$0** |
| | | | **Total/bulan** | **$0** |

> ⚠️ **Catatan:** Vercel Hobby Plan hanya untuk penggunaan **personal dan non-komersial**. Jika digunakan untuk keperluan bisnis, upgrade ke Pro ($20/bulan) diperlukan.

---

## 🗺️ Roadmap

### v1.0 — MVP (Target: Bulan 1)
- [x] Setup project (Next.js + Convex + Tailwind + shadcn/ui)
- [ ] Autentikasi dashboard (NextAuth.js)
- [ ] Schema database Convex
- [ ] CRUD artikel via dashboard
- [ ] Rich text editor (Tiptap)
- [ ] Halaman publik: Home, About, Blog list, Blog detail
- [ ] Deploy ke Vercel

### v1.1 — Content & SEO (Target: Bulan 2)
- [ ] Upload gambar via Cloudinary
- [ ] OG Image generator (`@vercel/og`)
- [ ] RSS Feed (`/feed.xml`)
- [ ] Halaman Projects/Portfolio
- [ ] Tag & filter artikel
- [ ] Reading time estimator

### v1.2 — Polish & Performance (Target: Bulan 3)
- [ ] Animasi page transition
- [ ] Dark mode
- [ ] Table of contents pada artikel panjang
- [ ] Syntax highlighting untuk blok kode (via `highlight.js` atau `shiki`)
- [ ] Search artikel
- [ ] Sitemap otomatis (`/sitemap.xml`)
- [ ] JSON-LD structured data untuk SEO

### v2.0 — Future Ideas
- [ ] Newsletter subscription (via Resend — free 3.000 email/bulan)
- [ ] View counter per artikel (via Convex)
- [ ] Comment section (via Giscus — GitHub Discussions)
- [ ] Multiple language (i18n) — EN/ID

---

## 🤝 Contributing

Project ini bersifat personal, namun issue dan saran sangat diterima!

1. Fork repository ini
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: tambah fitur X'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request

### Commit Convention

Project ini mengikuti [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     Fitur baru
fix:      Bug fix
docs:     Perubahan dokumentasi
style:    Formatting (tidak mengubah logika)
refactor: Refactor kode
chore:    Update dependencies, konfigurasi, dll
```

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 👤 Author

**Andrie Wijaya**

- Website: [andriewijaya.me](https://andriewijaya.dev) *(coming soon)*
- GitHub: [@andriewijaya](https://github.com/andriewijaya)

---

<p align="center">
  Dibuat dengan ❤️ menggunakan Next.js, Convex, dan Tailwind CSS
</p>
