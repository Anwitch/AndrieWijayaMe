import { internalMutation } from "./_generated/server";
import { normalizePress } from "./lib/validation";

const SLUG = "aterostop";

const PROJECT = {
  title: "ATEROSTOP",
  year: "2026",
  tags: "Flutter, Supabase, IoT, AI",
  link: "https://dikti.kemdiktisaintek.go.id/publikasi/berita/mahasiswa-universitas-tanjungpura-kembangkan-aterostop-perangkat-ai-untuk-deteksi-dini-aterosklerosis-karotis",
  description:
    "Prototipe perangkat biomedis portabel berbasis AI untuk deteksi dini aterosklerosis pada arteri karotis, didanai PKM-KC 2026. Aku membangun aplikasi mobile Flutter-nya dan merancang arsitektur pairing serta sinkronisasi data antara perangkat, cloud, dan aplikasi.",
};

const PRESS = [
  {
    publisher: "Kemdiktisaintek (Ditjen Dikti)",
    title:
      "Mahasiswa Universitas Tanjungpura Kembangkan ATEROSTOP, Perangkat AI untuk Deteksi Dini Aterosklerosis Karotis",
    url: PROJECT.link,
    date: "2026-09-14",
  },
  {
    publisher: "Universitas Tanjungpura",
    title:
      "Mahasiswa Universitas Tanjungpura Kembangkan ATEROSTOP, Perangkat AI untuk Deteksi Dini Aterosklerosis Karotis",
    url: "https://untan.ac.id/mahasiswa-universitas-tanjungpura-kembangkan-aterostop-perangkat-ai-untuk-deteksi-dini-aterosklerosis-karotis/",
    date: "2026-09-09",
  },
  {
    publisher: "HiPontianak",
    title:
      "Mahasiswa Untan Ciptakan ATEROSTOP, Alat AI untuk Deteksi Dini Penyumbatan Pembuluh Darah",
    url: "https://hipontianak.com/mahasiswa-untan-ciptakan-aterostop-alat-ai-untuk-deteksi-dini-penyumbatan-pembuluh-darah/",
    date: "2026-09-07",
  },
  {
    publisher: "Berita Borneo",
    title:
      "Mahasiswa Untan Kembangkan ATEROSTOP, Perangkat AI untuk Deteksi Dini Aterosklerosis",
    url: "https://beritaborneo.co.id/mahasiswa-untan-kembangkan-aterostop-perangkat-al-untuk-deteksi-dini-aterosklerosis/",
    date: "2026-09-05",
  },
  {
    publisher: "Nusantara Post",
    title:
      "Mahasiswa Untan Kembangkan ATEROSTOP, Perangkat AI untuk Deteksi Dini Aterosklerosis",
    url: "https://www.nusantarapost.news/techsphere/mahasiswa-untan-kembangkan-aterostop-perangkat-ai-untuk-deteksi-dini-aterosklerosis",
    date: "2026-09-03",
  },
  {
    publisher: "Radio Republik Indonesia",
    title: "Siaran langsung RRI tentang ATEROSTOP",
    url: "https://www.youtube.com/live/fDNy797ITWo",
  },
];

const EXPERIENCE = {
  title: "ATEROSTOP — PKM Karsa Cipta 2026",
  period: "2026",
  description:
    "Anggota tim lima mahasiswa lintas disiplin Universitas Tanjungpura yang mengembangkan ATEROSTOP, prototipe perangkat biomedis berbasis AI untuk deteksi dini aterosklerosis pada arteri karotis. Program ini didanai melalui PKM-KC Tahun Anggaran 2026. Aku membangun aplikasi mobile-nya dan merancang arsitektur sistem: alur pairing dan struktur data untuk sinkronisasi antara perangkat, cloud, dan aplikasi.",
  role: "Aplikasi Mobile & Arsitektur Sistem",
  capabilities: "Flutter, Supabase",
  base: "Universitas Tanjungpura, Pontianak",
  organization: "Tim PKM-KC ATEROSTOP, Universitas Tanjungpura",
  projectSlug: SLUG,
};

const CASE_STUDY = `## Masalah

Aterosklerosis pada arteri karotis — penyempitan pembuluh darah di leher akibat penumpukan plak — meningkatkan risiko strok dan sering berkembang tanpa gejala. Pemeriksaan standarnya, Digital Subtraction Angiography dan USG Doppler, membutuhkan alat besar, biaya tinggi, dan tenaga kesehatan terlatih. Akibatnya skrining jarang terjadi sebelum ada keluhan.

## Yang Kami Bangun

ATEROSTOP adalah prototipe perangkat portabel noninvasif yang menggabungkan beberapa indikator dalam satu pemeriksaan berdurasi kurang dari lima menit:

- **Sinyal PPG di ujung jari** (sensor MAX30105) untuk mengestimasi tekanan darah, glukosa, dan kolesterol.
- **Suara aliran darah di leher** (mikrofon MEMS SPH0645LM4HB) untuk mendeteksi bruit karotis, bunyi khas akibat aliran yang turbulen.
- **Pemrosesan di perangkat.** Raspberry Pi 4 menjalankan pemrosesan sinyal dan inferensi model secara lokal, lalu menggabungkan seluruh hasil menjadi klasifikasi risiko aterosklerosis.
- **Aplikasi mobile dan cloud** untuk menampilkan hasil, menyimpan riwayat, dan memberi rekomendasi tindak lanjut.

Proyek ini dikerjakan tim lima mahasiswa Universitas Tanjungpura dari Sistem Komputer, Teknik Informatika, Teknik Industri, dan Pendidikan Dokter, dan didanai melalui Program Kreativitas Mahasiswa Karsa Cipta (PKM-KC) Tahun Anggaran 2026.

## Bagianku

Model AI, perangkat keras, dan seluruh program di sisi Raspberry Pi dikerjakan rekan tim. Kontribusiku ada di dua hal:

**Membangun aplikasi mobile (Flutter).**

- Onboarding, autentikasi, dan multiprofil pasien.
- Pairing perangkat lewat pemindaian QR code dan PIN yang berlaku 10 menit.
- Dashboard hasil pemeriksaan yang diperbarui secara real-time.
- Riwayat dengan grafik, ekspor CSV, dan pembaruan aplikasi over-the-air.
- Rekomendasi tindak lanjut tiga tingkat (normal, waspada, perlu evaluasi) berdasarkan ambang klinis Kementerian Kesehatan dan PERKENI.

**Merancang arsitektur sistemnya.** Aku merancang bagaimana perangkat, cloud, dan aplikasi saling berbicara: alur pairing, struktur data di Supabase, dan cara hasil pemeriksaan disinkronkan — termasuk saat perangkat dipakai tanpa internet. Rancangan itu menjadi kontrak yang diimplementasikan rekan tim di sisi perangkat dan olehku di sisi aplikasi.

## Keputusan Desain

Perangkat dan ponsel tidak pernah terhubung langsung. Keduanya hanya berbicara ke Supabase: perangkat mendaftarkan sesi pairing, ponsel memverifikasinya, dan perangkat mengetahui hasilnya lewat kanal real-time. Dengan begitu pairing tidak bergantung pada kedua perangkat berada di jaringan yang sama, dan tidak ada port yang perlu dibuka di sisi alat.

Pemisahan ini juga membuat dua sisi bisa dikerjakan paralel. Selama struktur datanya disepakati, aplikasi dan program di perangkat dapat dibangun dan diuji masing-masing sebelum digabungkan.

## Hasil

- Survei penerimaan terhadap 175 responden menghasilkan indeks 89,72%.
- Pada uji klasifikasi awal (5 subjek, 25 pemeriksaan), akurasi 80% dengan AUC 0,825 untuk aterosklerosis dan 0,85 untuk deteksi bruit.
- Estimasi tekanan darah sistolik memiliki MAE 9,83 mmHg pada 35 subjek dengan 149 pasangan pengukuran.

ATEROSTOP masih berupa prototipe skrining awal, bukan alat diagnosis. Jumlah subjek uji klasifikasi masih kecil, sehingga pengujian klinis dengan subjek yang lebih banyak menjadi langkah berikutnya.

## Teknologi

Bagianku: Flutter, Riverpod, Supabase (PostgreSQL, Realtime). Sisi perangkat dan model AI (rekan tim): Raspberry Pi 4, Python, Scikit-learn, XGBoost.`;

/**
 * Idempotent seed for the ATEROSTOP project and its experience entry. Run via
 * `npx convex run seedAterostop:apply [--prod]`. Re-running refreshes the
 * content but leaves ordering and publish/featured flags as set in admin.
 */
export const apply = internalMutation({
  args: {},
  handler: async (ctx) => {
    const summary: string[] = [];
    const now = Date.now();
    const content = {
      ...PROJECT,
      slug: SLUG,
      caseStudy: CASE_STUDY,
      press: normalizePress(PRESS),
      updatedAt: now,
    };

    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", SLUG))
      .unique();
    if (project) {
      await ctx.db.patch("projects", project._id, content);
      summary.push("updated project 'ATEROSTOP'");
    } else {
      const [highest] = await ctx.db
        .query("projects")
        .withIndex("by_sortOrder")
        .order("desc")
        .take(1);
      await ctx.db.insert("projects", {
        ...content,
        isFeatured: true,
        isPublished: true,
        sortOrder: (highest?.sortOrder ?? 0) + 1,
        createdAt: now,
      });
      summary.push("created project 'ATEROSTOP'");
    }

    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_sortOrder")
      .order("desc")
      .take(50);
    const experience = experiences.find((row) => row.projectSlug === SLUG);
    if (experience) {
      await ctx.db.patch("experiences", experience._id, {
        ...EXPERIENCE,
        updatedAt: now,
      });
      summary.push("updated experience entry");
    } else {
      await ctx.db.insert("experiences", {
        ...EXPERIENCE,
        isPublished: true,
        sortOrder: (experiences[0]?.sortOrder ?? 0) + 1,
        createdAt: now,
        updatedAt: now,
      });
      summary.push("created experience entry");
    }

    return summary;
  },
});
