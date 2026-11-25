import { internalMutation } from "./_generated/server";

const SLUG = "permata-diskominfo";

const PROJECT = {
  title: "PERMATA",
  year: "2025",
  tags: "Next.js, Express, Prisma, MySQL, Gemini",
  description:
    "Platform magang terintegrasi untuk Diskominfo Kalimantan Barat — satu alur dari pengajuan kebutuhan magang oleh Perangkat Daerah sampai penerbitan sertifikat, dengan dashboard per peran dan ringkasan logbook berbantuan AI.",
};

const CASE_STUDY = `## Masalah

Administrasi magang di Diskominfo Kalimantan Barat tersebar di banyak tempat. Pengajuan kebutuhan dari Perangkat Daerah, pendaftaran mahasiswa, validasi berkas, logbook harian, monitoring, sampai sertifikat berjalan terpisah dan sebagian besar manual. Setiap pihak memegang potongan prosesnya sendiri, dan tidak ada satu tempat untuk melihat status magang secara utuh.

## Yang Aku Rancang

Sebelum menulis kode, aku memetakan alur magang dari awal sampai akhir untuk lima peran: mahasiswa, dosen pembimbing, PIC sekolah/kampus, mentor Perangkat Daerah, dan administrator. Hasil pemetaan itu jadi dasar dashboard dan alur kerja per peran:

- **Pengajuan dan lowongan:** Perangkat Daerah mengajukan kebutuhan magang, lalu lowongannya dipublikasikan secara terbuka.
- **Pendaftaran digital:** mahasiswa mendaftar sendiri atau secara kolektif lewat PIC kampusnya.
- **Validasi dan dokumen:** berkas diperiksa di dalam platform dan disimpan di object storage.
- **Logbook dan monitoring:** kegiatan harian dicatat, lalu diringkas otomatis tiap minggu dengan Gemini supaya mentor dan dosen tidak perlu membaca satu per satu.
- **Evaluasi dan sertifikat:** penilaian terintegrasi, dan sertifikat digital terbit dari data yang sama.

## Keputusan Desain

**Satu sumber data untuk semua peran.** Masalah utamanya bukan kurang fitur, tapi proses yang terputus. Karena itu semua peran bekerja di atas data yang sama; yang berbeda hanya tampilan dan hak aksesnya.

**AI sebagai layanan terpisah.** Integrasi Gemini dijalankan sebagai service tersendiri, sehingga backend utama tetap sederhana dan fitur AI bisa diganti atau dimatikan tanpa menyentuh alur inti.

## Teknologi

Next.js 15 (App Router, TypeScript, Tailwind CSS), Node.js dan Express dengan arsitektur modular monolith, Prisma, MySQL, MinIO, dan Google Gemini.`;

/**
 * Idempotent content refresh for the PERMATA project. Run via
 * `npx convex run seedPermata:apply [--prod]`. Leaves ordering, cover and
 * publish/featured flags as set in admin.
 */
export const apply = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const content = {
      ...PROJECT,
      slug: SLUG,
      caseStudy: CASE_STUDY,
      updatedAt: now,
    };

    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", SLUG))
      .unique();
    if (project) {
      await ctx.db.patch("projects", project._id, content);
      return "updated project 'PERMATA'";
    }

    const [highest] = await ctx.db
      .query("projects")
      .withIndex("by_sortOrder")
      .order("desc")
      .take(1);
    await ctx.db.insert("projects", {
      ...content,
      isFeatured: false,
      isPublished: true,
      sortOrder: (highest?.sortOrder ?? 0) + 1,
      createdAt: now,
    });
    return "created project 'PERMATA'";
  },
});
