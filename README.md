# anwitch.me — situs pribadi Andrie Wijaya

Situs portofolio dan tulisan di [anwitch.me](https://anwitch.me), dengan CMS sendiri ("Mission Control") untuk mengelola profil, proyek, pengalaman, tulisan, dan media tanpa menyentuh kode.

## Stack

| Bagian | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Backend & database | [Convex](https://convex.dev) (query/mutation, file storage) |
| Autentikasi admin | Convex Auth (email + password, dibatasi ke `ADMIN_EMAIL`) |
| Hosting frontend | Vercel (project `andriewijayame`) |
| Tes | Vitest + convex-test |

> Next.js dan Convex di repo ini lebih baru dari kebanyakan contoh di internet. Baca `AGENTS.md` dan `convex/_generated/ai/guidelines.md` sebelum menulis kode.

## Halaman

| Rute | Isi |
|---|---|
| `/` | Hero, ringkasan, proyek pilihan, FAQ, pendidikan, pengalaman |
| `/about` | Profil dan cara kerja |
| `/projects`, `/projects/[slug]` | Arsip proyek dan halaman studi kasus (termasuk liputan media) |
| `/writing`, `/writing/[slug]` | Tulisan, dwibahasa ID/EN |
| `/thisisandwitch` | Mission Control (admin) |
| `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/llms.txt` | Dibuat otomatis dari data |

## Struktur

```
convex/                 Backend Convex
  schema.ts             Skema semua tabel
  projects.ts           Proyek, studi kasus, liputan media
  experiences.ts        Daftar pengalaman
  posts.ts, profile.ts, media.ts, siteSettings.ts
  seed*.ts              Seed data sekali jalan (idempotent)
  lib/                  Validasi, cek admin, resolusi cover
src/app/                Rute Next.js
src/components/         Komponen publik + mission-control/
src/components/ui.tsx   UI kit bersama (lihat docs/DESIGN_SYSTEM.md)
src/lib/                structured-data (JSON-LD), site-url, helper lain
docs/                   Design system, dokumen brand, rencana lama
```

## Data

Tabel di `convex/schema.ts`:

- `profile` — bio, tagline, pendidikan, satu entri pengalaman utama, tautan sosial.
- `experiences` — entri pengalaman tambahan (judul, periode, deskripsi, peran, organisasi, slug proyek terkait). Tampil di beranda setelah entri dari `profile`.
- `projects` — proyek, `slug` + `caseStudy` (Markdown) untuk halaman detail, dan `press` untuk liputan media.
- `posts` — tulisan dengan versi Indonesia opsional (`titleId`, `excerptId`, `contentId`).
- `media` — berkas di Convex storage (avatar, cover proyek, cover tulisan).
- `siteSettings` — nama situs, SEO default, label navigasi.

### Menambah proyek atau pengalaman

Semua lewat Mission Control, tidak perlu mengubah kode:

- **Proyek** — isi form "New Mission". Mengisi `slug` mengaktifkan halaman `/projects/<slug>`.
- **Liputan media** — di form proyek, satu baris per liputan:
  `Publisher | Judul artikel | https://... | 2026-09-09` (tanggal opsional).
- **Pengalaman** — panel "Experience". Isi "Related project slug" untuk menautkan ke studi kasus.

JSON-LD ikut terbentuk dari data ini: pengalaman menjadi peran pada `Person` di beranda, dan liputan menjadi `NewsArticle` yang ditautkan ke proyeknya. Halaman baru otomatis masuk `sitemap.xml` dan `llms.txt`.

## Menjalankan secara lokal

Butuh Node.js 20 atau lebih baru.

```bash
npm ci
npx convex dev     # terminal 1: sinkronkan fungsi ke deployment dev
npm run dev        # terminal 2: http://localhost:3000
```

`npx convex dev` mengisi `.env.local` dengan deployment dev. Mission Control ada di `/thisisandwitch`.

```bash
npm test                 # vitest
npx tsc --noEmit -p .    # typecheck
npm run lint
```

## Environment

Frontend (`.env.local` secara lokal, Environment Variables di Vercel):

| Variabel | Keterangan |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | URL deployment Convex |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | URL `.convex.site` deployment yang sama |
| `NEXT_PUBLIC_SITE_URL` | Opsional; default `https://anwitch.me` |

Deployment Convex (diatur dengan `npx convex env set`, tambahkan `--prod` untuk produksi):

| Variabel | Keterangan |
|---|---|
| `ADMIN_EMAIL` | Satu-satunya akun yang boleh masuk Mission Control |
| `ADMIN_SETUP_SECRET` | Hanya saat membuat akun admin pertama; hapus setelahnya |
| `SITE_URL` | URL situs untuk Convex Auth |

## Deployment

Ada dua bagian yang di-deploy terpisah.

| Bagian | Tujuan | Cara |
|---|---|---|
| Frontend | Vercel, project `andriewijayame` (domain `anwitch.me`, `www` dialihkan ke apex) | Otomatis setiap push ke `main` |
| Backend | Convex produksi `adorable-mule-798` | Manual: `npx convex deploy` |

Deployment Convex dev (`tame-puffin-255`) hanya dipakai secara lokal. Data di dev tidak ikut ke produksi.

**Urutan saat `convex/` berubah:** deploy backend dulu, baru push.

```bash
npx convex deploy -y                            # 1. fungsi + skema ke produksi
npx convex run <modul>:<fungsi> --prod          # 2. seed, kalau ada
git push origin main                            # 3. Vercel build dan rilis
```

Vercel tidak men-deploy Convex (tidak ada `CONVEX_DEPLOY_KEY` di project). Kalau push lebih dulu, frontend baru akan memanggil fungsi yang belum ada di produksi dan halamannya error sampai `npx convex deploy` dijalankan. Perubahan yang hanya menyentuh `src/` cukup di-push.

`Dockerfile` dan `docker-compose.yml` adalah sisa hosting VPS sebelumnya dan tidak dipakai oleh Vercel.
