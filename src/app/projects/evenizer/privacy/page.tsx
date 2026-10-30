import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PublicShell from "@/components/PublicShell";
import { MonoLink, PageHeader } from "@/components/ui";
import { SITE_URL } from "@/lib/site-url";

const title = "Kebijakan Privasi Evenizer";
const description =
  "Cara Evenizer memakai data Google Drive: berjalan di laptop pengguna, tanpa server terpisah, dan tidak membagikan data ke pihak lain.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects/evenizer/privacy" },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/projects/evenizer/privacy`,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function EvenizerPrivacyPage() {
  return (
    <PublicShell>
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24 animate-fade-in-up">
        <MonoLink href="/projects/evenizer" className="mb-12 group">
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Kembali ke Evenizer
        </MonoLink>

        <PageHeader
          eyebrow="Berlaku sejak 30 Oktober 2026"
          title={title}
          lede="Evenizer adalah aplikasi pribadi buatan Andrie Wijaya untuk memilih dan mengunduh foto dari dokumentasi kegiatan di Google Drive. Halaman ini menjelaskan data apa yang dipakai dan ke mana data itu pergi."
        />

        <article
          className="prose max-w-none
          prose-headings:text-ink prose-headings:font-semibold
          prose-p:text-ink-secondary prose-p:leading-relaxed
          prose-li:text-ink-secondary
          prose-strong:text-ink prose-strong:font-semibold
          prose-a:text-accent
          prose-code:text-accent prose-code:bg-accent-subtle prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none"
        >
          <h2>Data Google yang diakses</h2>
          <p>
            Evenizer meminta izin akses Google Drive (
            <code>https://www.googleapis.com/auth/drive</code>) setelah
            pengguna login dengan akun Google. Izin ini dipakai untuk:
          </p>
          <ul>
            <li>
              membaca daftar foto, metadata, pratinjau, dan file asli dari
              folder kegiatan yang dipilih pengguna;
            </li>
            <li>
              membaca hasil pemindaian foto dari folder proyek Evenizer di Drive
              pengguna, termasuk data vektor wajah dan fitur gambar;
            </li>
            <li>
              menyimpan daftar foto pilihan ke file{" "}
              <code>review-&lt;id kegiatan&gt;.json</code> di folder proyek
              tersebut.
            </li>
          </ul>
          <p>
            Evenizer tidak menulis, mengubah, atau menghapus file di folder
            dokumentasi kegiatan.
          </p>

          <h2>Tempat data disimpan</h2>
          <ul>
            <li>
              <strong>Di laptop pengguna:</strong> token login, pengaturan, dan
              cache lokal disimpan di <code>%APPDATA%\Evenizer\</code>. Foto
              yang diunduh disimpan di folder yang dipilih pengguna. Aplikasi
              hanya bisa diakses dari laptop itu lewat <code>127.0.0.1</code>.
            </li>
            <li>
              <strong>Di Google Drive pengguna:</strong> hasil pemindaian dan
              daftar foto pilihan disimpan di folder proyek Evenizer.
            </li>
          </ul>
          <p>
            Evenizer tidak memiliki server sendiri, sehingga pengembang tidak
            menerima foto, data wajah, atau token login pengguna.
          </p>

          <h2>Pembagian data</h2>
          <p>
            Data tidak dijual, tidak dipakai untuk iklan, tidak dibagikan ke
            pihak ketiga, dan tidak dipakai untuk melatih model AI umum.
            Aplikasi hanya berkomunikasi dengan layanan Google: Drive API untuk
            data di atas, dan Google Fonts untuk memuat font tampilan.
          </p>
          <p>
            Penggunaan dan pemindahan informasi yang diterima dari Google API
            oleh Evenizer mematuhi{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google API Services User Data Policy
            </a>
            , termasuk ketentuan Limited Use.
          </p>

          <h2>Menghapus data dan mencabut akses</h2>
          <ul>
            <li>
              Hapus folder <code>%APPDATA%\Evenizer\</code> untuk logout dan
              membersihkan cache di laptop.
            </li>
            <li>
              Hapus folder <code>Data Evenizer</code> di Drive untuk menghapus
              hasil pemindaian dan daftar foto pilihan.
            </li>
            <li>
              Cabut akses aplikasi di{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
              >
                pengaturan akun Google
              </a>
              .
            </li>
          </ul>

          <h2>Perubahan dan kontak</h2>
          <p>
            Kalau kebijakan ini berubah, versi terbarunya ditampilkan di halaman
            ini beserta tanggal berlakunya. Pertanyaan bisa disampaikan lewat
            kontak di <Link href="/about">halaman Tentang</Link>.
          </p>
        </article>
      </main>
    </PublicShell>
  );
}
