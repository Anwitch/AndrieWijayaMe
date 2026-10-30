import { internalMutation } from "./_generated/server";

const SLUG = "evenizer";

const PROJECT = {
  title: "Evenizer",
  year: "2026",
  tags: "Tools, Python, FastAPI, Google Drive API, Computer Vision",
  description:
    "Alat pribadi untuk mengumpulkan foto diriku dan momen kegiatan dari dokumentasi Google Drive yang tersebar di banyak folder. Foto yang berisi diriku tampil paling atas, lalu bisa dipilih dan diunduh dalam resolusi asli untuk postingan atau portofolio.",
};

const CASE_STUDY = `## Masalah

Setiap selesai ikut kegiatan, dokumentasinya biasanya dibagikan lewat link Google Drive. Link itu tersebar di banyak tempat, dan satu kegiatan bisa punya beberapa folder dengan ratusan foto.

Saat butuh foto untuk postingan atau portofolio, aku harus membuka folder satu per satu dan mencari foto yang ada diriku secara manual. Foto yang bagus mudah terlewat, dan momen kegiatannya sendiri ikut tenggelam di antara ratusan foto lain.

## Yang Aku Bangun

Evenizer mengumpulkan foto dari folder dokumentasi kegiatan ke satu tempat, lalu menyusunnya supaya mudah dipilih:

- **Foto diriku paling atas.** Wajah di setiap foto dibandingkan dengan foto referensiku. Foto dengan kemiripan di perbatasan dipisahkan sebagai "Mungkin Aku", jadi tidak hilang.
- **Foto mirip berdekatan.** Burst dan pose serupa dikelompokkan supaya mudah dibandingkan, dan aku bisa memilih lebih dari satu foto dari kelompok yang sama.
- **Momen kegiatan tetap terlihat.** Bukan hanya foto diriku, semua foto kegiatan bisa dilihat dan disaring per folder sumber.
- **Tampilan besar.** Foto bisa dibuka layar penuh, dengan tombol panah untuk pindah dan spasi untuk memilih.
- **Unduh langsung.** Foto terpilih diunduh dalam resolusi asli ke folder di laptop, dan foto yang sudah pernah diunduh dilewati.

## Keputusan Desain

**Pemindaian dan review dipisah.** Mendeteksi wajah dan menghitung fitur gambar butuh komputasi berat, jadi tahap itu berjalan di Google Colab dan hasilnya disimpan di Drive. Aplikasi di laptop hanya membaca hasilnya, sehingga tetap ringan saat dipakai memilih foto.

**Tidak ada foto yang disembunyikan otomatis.** Penyaringan duplikat otomatis memilih foto berdasarkan skor, padahal skor tertinggi belum tentu foto terbaik. Di Evenizer, foto mirip hanya diletakkan berdekatan, dan keputusan akhirnya tetap di tanganku.

**Berjalan di laptop sendiri.** Foto kegiatan dan data wajah termasuk data sensitif, jadi aplikasinya hanya bisa diakses dari laptop lewat \`127.0.0.1\` dan tidak ada server terpisah. Folder dokumentasi panitia juga tidak pernah ditulisi. Detailnya ada di [Kebijakan Privasi](/projects/evenizer/privacy).

## Teknologi

Python, FastAPI, Google Drive API, Google Colab, SFace untuk pengenalan wajah, SigLIP2 untuk kemiripan gambar, serta HTML, CSS, dan JavaScript tanpa build step.`;

/**
 * Idempotent seed for the Evenizer project. Run via
 * `npx convex run seedEvenizer:apply [--prod]`. Re-running refreshes the
 * content but leaves ordering and publish/featured flags as set in admin.
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
      return "updated project 'Evenizer'";
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
    return "created project 'Evenizer'";
  },
});
