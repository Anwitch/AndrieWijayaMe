import { internalMutation } from "./_generated/server";

const SLUG = "mouse-pointer";

const PROJECT = {
  title: "Mouse Pointer",
  year: "2026",
  tags: "Python, Win32 API, Open Source",
  link: "https://github.com/Anwitch/mouse-pointer",
  description:
    "Aplikasi Windows yang mengubah mouse biasa jadi pointer presentasi, lengkap dengan timer. Hanya mouse yang dipilih yang berubah jadi tombol slide; touchpad dan mouse lain tetap normal. Gratis dan open source.",
};

const CASE_STUDY = `## Masalah

Aku tidak punya pointer presentasi. Yang ada mouse wireless.

Mouse saja ternyata belum cukup. Klik tidak selalu berarti pindah slide: klik kanan memunculkan menu, scroll bisa melompati beberapa slide sekaligus, dan tiap aplikasi presentasi memperlakukan klik dengan caranya sendiri. Yang sebenarnya dibutuhkan hanya dua tombol, maju dan mundur, yang di semua aplikasi presentasi sama: panah kanan dan panah kiri.

Mengubah semua klik jadi tombol panah juga bukan jawaban. Laptop tetap perlu dipakai normal selama presentasi, misalnya untuk membuka file lain atau memutar video. Jadi yang berubah hanya mouse yang dipegang presenter, sementara touchpad laptop tetap jadi touchpad.

## Yang Aku Bangun

Aplikasi kecil di system tray. Selama mode presentasi aktif, mouse yang dipilih bekerja seperti pointer:

- **Klik kiri, tombol samping depan, scroll ke bawah:** slide berikutnya.
- **Klik kanan, tombol samping belakang, scroll ke atas:** slide sebelumnya.
- **Klik tengah:** mulai atau jeda timer presentasi.
- **Gerakan:** tetap normal.

Mouse dipilih dari menu tray. Daftarnya diperbarui otomatis saat dongle dicolok atau dicabut, jadi tidak perlu mencari ID perangkat secara manual.

Timer muncul di pojok layar, selalu di atas slide, dan klik tembus sehingga tidak menghalangi apa pun. Warnanya berubah mengikuti sisa waktu: kuning dengan bunyi pendek saat sisa satu menit, merah dengan tiga bunyi panjang saat waktu habis, lalu menghitung kelebihannya.

## Keputusan Desain

**Membedakan klik berdasarkan perangkat asalnya.** Hook mouse biasa di Windows tidak tahu sebuah klik datang dari mouse mana. Raw Input tahu asalnya, tapi tidak bisa menahan klik. Jadi aplikasi ini memakai keduanya: klik ditahan sebentar, paling lama 60 milidetik, sampai Raw Input memberi tahu asalnya. Klik dari mouse presentasi diubah jadi tombol panah, sisanya diteruskan apa adanya. Kedua jalur ini bisa melapor dengan urutan terbalik, jadi logika pencocokannya kupisahkan dari Win32 dan diuji tersendiri.

**Bunyi yang benar-benar terdengar.** Versi awal memakai bunyi bip bawaan Windows, yang ternyata keluar lewat buzzer PC. Di banyak laptop buzzer itu tidak bersuara, jadi peringatan satu menit lewat begitu saja. Sekarang nadanya dibuat sendiri sebagai berkas audio di memori dan diputar lewat speaker biasa.

**Timer yang tidak mengganggu slide.** Jendela timer tidak pernah mengambil fokus. Kalau fokus berpindah ke timer, tombol panah tidak sampai ke aplikasi presentasi dan slide berhenti berganti.

## Dibagikan Terbuka

Kode sumbernya terbuka di GitHub dengan lisensi MIT. Ada versi \`.exe\` yang bisa langsung dijalankan tanpa memasang Python. Aplikasi ini khusus Windows.

## Teknologi

Python, ctypes (Win32 API: low-level mouse hook, Raw Input, SendInput), tkinter, pystray.`;

/**
 * Idempotent seed for the Mouse Pointer project. Run via
 * `npx convex run seedMousePointer:apply [--prod]`. Re-running refreshes the
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
      return "updated project 'Mouse Pointer'";
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
    return "created project 'Mouse Pointer'";
  },
});
