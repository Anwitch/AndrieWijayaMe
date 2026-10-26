import { internalMutation } from "./_generated/server";

const SLUG = "otirra";

const PROJECT = {
  title: "Otirra",
  year: "2026",
  tags: "Verilog, FPGA, Python, cocotb",
  description:
    "Inti cip rancangan lokal yang memproses OAE dan AABR menjadi keputusan PASS/REFER otomatis untuk skrining pendengaran bayi baru lahir, dibangun di Hackathon Deeptech 2026: Indonesia Chip Hackathon Challenge sebagai salah satu dari 15 tim finalis nasional. Aku mengerjakan pemrosesan data dari dataset rekaman dan tooling verifikasinya.",
};

const EXPERIENCE = {
  title: "Otirra — Finalis Indonesia Chip Hackathon Challenge 2026",
  period: "2026",
  description:
    "Satu dari 15 tim finalis nasional Hackathon Deeptech 2026 yang diselenggarakan ICDeC dan Pusat Mikroelektronika ITB bersama Kemdiktisaintek. Tim lima mahasiswa Universitas Tanjungpura ini merancang Otirra, inti cip untuk skrining pendengaran bayi baru lahir, dan mengimplementasikannya di FPGA dalam tiga hari. Aku mengerjakan pemrosesan data dari dataset rekaman, model acuan Python, dan pengujian bit-exact untuk RTL-nya.",
  role: "Pemrosesan Data & Tooling Verifikasi",
  capabilities: "Python, NumPy, cocotb, Verilator",
  base: "ICDeC, ITB Innovation Park, Bandung",
  organization: "Tim Lipra, Universitas Tanjungpura",
  projectSlug: SLUG,
};

const CASE_STUDY = `## Masalah

Skrining pendengaran bayi baru lahir termasuk program Kementerian Kesehatan, tapi cakupannya masih sangat rendah. Diperkirakan 4.500–13.400 bayi di Indonesia lahir dengan tuli kongenital setiap tahun. Tanpa skrining, gangguan ini rata-rata baru diketahui di usia 28 bulan; dengan skrining, sekitar 3 bulan.

Hambatannya ada di alat. Alat OAE di e-Katalog pemerintah adalah produk impor seharga sekitar Rp126 juta dengan TKDN 0%. Dokter THT di Asia Tenggara juga hanya 1,12 per 100.000 penduduk, jadi hasil skrining perlu otomatis supaya bisa dioperasikan tenaga kesehatan non-spesialis di puskesmas.

## Yang Kami Bangun

Otirra adalah satu inti digital yang menjalankan dua metode skrining:

- **OAE** merekam gema akustik dari koklea lewat mikrofon di probe telinga.
- **AABR** merekam respons saraf auditori dan batang otak lewat elektroda.

Kedua mode berbagi blok pewaktuan stimulus, penolakan artefak, perata-rataan, dan logika keputusan. Hasilnya PASS, REFER, atau TIDAK VALID per telinga, dikirim lewat UART. Empat keputusan desain membuat inti ini kecil dan cepat:

- **Straight-line blanking.** Bunyi klik stimulus dihapus sebelum difilter, supaya tidak bocor dan terbaca sebagai respons palsu.
- **DC blocker dan FIR simetris terlipat.** Filter 1023-tap cukup dengan 512 perkalian, atau 514 clock per sampel.
- **Perata-rataan A/B bergantian.** A+B berisi sinyal dan derau, A−B hanya derau, sehingga derau terukur langsung tanpa sensor tambahan.
- **Hanya bilangan bulat, tanpa pembagi.** Syarat SNR 6 dB dihitung sebagai satu perkalian silang, tanpa pembagian, logaritma, atau akar.

Proyek ini dikerjakan tim Lipra, lima mahasiswa Teknik Elektro dan Teknik Informatika Universitas Tanjungpura, di Hackathon Deeptech 2026: Indonesia Chip Hackathon Challenge yang diselenggarakan Indonesia Chip Design Collaborative Center (ICDeC) dan Pusat Mikroelektronika ITB bersama Kemdiktisaintek. Proposalnya lolos sebagai salah satu dari 15 tim finalis nasional, dan prototipenya kami bangun dalam tiga hari di ITB Innovation Park, Bandung, 21–23 Oktober 2026.

## Bagianku

Desain RTL dan perangkat kerasnya dikerjakan rekan tim. Kontribusiku ada di dua hal:

**Pemrosesan data.** Aku membaca rekaman OAE dan ABR dari dataset PhysioNet dan menyiapkannya menjadi masukan yang sama untuk model acuan maupun testbench RTL, supaya keduanya diuji dengan data yang identik.

**Tooling verifikasi.** Aku membangun model acuan Python (fixed-point dan floating-point) untuk seluruh pipeline, testbench cocotb yang membandingkan keluaran RTL dengan model itu, dan pengukuran benchmark di board FPGA. Tujuannya memastikan yang dijalankan hardware sama persis dengan yang kami rancang di atas kertas.

## Hasil

Diukur di board AMD Kria KV260 pada 100 MHz:

- Bit-exact terhadap model acuan pada 3 dari 3 rekaman.
- 0 dari 55 keputusan berubah dibanding versi floating-point.
- 4,05× lebih cepat dari real time pada 48 kHz.
- Tambahan daya 0,058 W saat skrining, 3,7× lebih hemat dibanding ARM Cortex-A53 di chip yang sama, padahal ARM hanya menjalankan filter front-end.
- 514 clock per sampel tiga kanal, 13× lebih sedikit dari ARM, dan hanya memakai 6 dari 1.248 multiplier (0,5%).

Data uji berasal dari rekaman orang dewasa di PhysioNet, jadi angka di atas menguji algoritma dan hardware-nya, bukan klaim klinis. Langkah berikutnya adalah ethical clearance dan pengambilan data bayi bersama rumah sakit mitra.

## Teknologi

Bagianku: Python, NumPy, cocotb, Verilator. Tim: Verilog, Yosys, Vivado, AMD Kria KV260.`;

/**
 * Idempotent seed for the Otirra project and its experience entry. Run via
 * `npx convex run seedOtirra:apply [--prod]`. Re-running refreshes the
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
      updatedAt: now,
    };

    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", SLUG))
      .unique();
    if (project) {
      await ctx.db.patch("projects", project._id, content);
      summary.push("updated project 'Otirra'");
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
      summary.push("created project 'Otirra'");
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
