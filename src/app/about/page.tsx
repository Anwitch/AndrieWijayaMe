import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicShell from "@/components/PublicShell";
import { Eyebrow, PageHeader } from "@/components/ui";
import { getProfile } from "@/lib/profile.server";
import { getSiteSettings } from "@/lib/site-settings.server";
import { SITE_URL } from "@/lib/site-url";
import { socialLinks } from "@/lib/social-links";

const description =
  "Tentang Andrie Wijaya — product thinker & problem solver dari Pontianak yang merancang solusi digital dari masalah dunia nyata. Teknologi adalah alat; problem solving adalah identitas.";

export const metadata: Metadata = {
  title: "Tentang",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/about`,
    title: "Tentang | Andrie Wijaya",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang | Andrie Wijaya",
    description,
  },
};

export default async function AboutPage() {
  const [profile, settings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ]);

  const socials = socialLinks(profile);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about#profilepage`,
    url: `${SITE_URL}/about`,
    name: `Tentang ${settings.siteName}`,
    inLanguage: "id-ID",
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24 animate-fade-in-up">
        <PageHeader eyebrow="Profil" title={`Tentang ${settings.siteName}`} />

        <div className="flex flex-col sm:flex-row gap-8 items-start mb-16">
          <Image
            src="/FotoAndrieGantengKacamata.webp"
            alt={`Foto ${settings.siteName}, product thinker dan problem solver dari Pontianak`}
            width={160}
            height={160}
            className="rounded-sm shrink-0"
            priority
          />
          <div className="text-lg text-ink-secondary leading-relaxed">
            <p>
              Aku {settings.siteName}, seorang{" "}
              <strong className="text-ink">
                product thinker dan problem solver
              </strong>{" "}
              yang berbasis di {profile?.location || "Pontianak, Kalimantan Barat"}.
              Aku mendokumentasikan proses memahami masalah dunia nyata, lalu
              merancang bagaimana teknologi dapat menyelesaikannya.
            </p>
          </div>
        </div>

        <article className="space-y-16">
          <section>
            <Eyebrow as="h2" className="block mb-6">
              Siapa Aku
            </Eyebrow>
            <div className="space-y-6 text-lg text-ink-secondary leading-relaxed">
              <p>
                Aku tidak ingin dikenal sekadar sebagai AI engineer, software
                engineer, atau programmer. Aku ingin dikenal sebagai seseorang
                yang mampu melihat masalah di dunia nyata, memahami akar
                penyebabnya, lalu mendesain solusi digital yang benar-benar
                bermanfaat.
              </p>
              <p>
                Teknologi bukan tujuan utamaku — teknologi hanyalah alat untuk
                menyelesaikan masalah. Yang membuatku bersemangat bukanlah
                coding, AI, atau framework terbaru, melainkan menemukan proses
                yang tidak efisien dan membayangkan bagaimana proses tersebut
                dapat dibuat jauh lebih sederhana.
              </p>
            </div>
          </section>

          <section>
            <Eyebrow as="h2" className="block mb-6">
              Cara Berpikirku
            </Eyebrow>
            <div className="space-y-6 text-lg text-ink-secondary leading-relaxed">
              <p>
                Ketika melihat suatu aktivitas, pertanyaan pertamaku bukan
                “teknologi apa yang bisa dipakai?”, melainkan:
              </p>
              <ul className="space-y-3 border-l-2 border-ink pl-6 italic">
                <li>“Kenapa proses ini masih seperti ini?”</li>
                <li>“Kenapa belum didigitalisasi?”</li>
                <li>
                  “Apa yang membuat belum ada solusi yang benar-benar dipakai?”
                </li>
              </ul>
              <p>
                Aku menikmati proses memahami bagaimana suatu sistem bekerja
                sebelum mencoba memperbaikinya — melalui observasi, wawancara,
                dan rasa penasaran terhadap proses bisnis di industri apa pun.
              </p>
            </div>
          </section>

          <section>
            <Eyebrow as="h2" className="block mb-6">
              Cara Kerjaku
            </Eyebrow>
            <ol className="space-y-4 text-lg text-ink-secondary leading-relaxed list-none">
              {[
                "Menemukan fenomena menarik di kehidupan nyata.",
                "Bertanya mengapa proses tersebut masih dilakukan dengan cara sekarang.",
                "Mencari tahu proses bisnis sebenarnya melalui observasi atau wawancara.",
                "Memahami alasan mengapa solusi belum diterapkan.",
                "Merancang kemungkinan solusi digital.",
                "Mendokumentasikan seluruh proses berpikir tersebut.",
              ].map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-mono text-xs text-accent pt-2 tabular-nums">
                    0{i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <Eyebrow as="h2" className="block mb-6">
              Fokus Saat Ini
            </Eyebrow>
            <div className="space-y-4 text-lg text-ink-secondary leading-relaxed">
              {profile?.specialization && (
                <p>
                  <span className="font-semibold text-ink">
                    Spesialisasi:
                  </span>{" "}
                  {profile.specialization}
                </p>
              )}
              {profile?.currentFocus && (
                <p>
                  <span className="font-semibold text-ink">
                    Sedang mendalami:
                  </span>{" "}
                  {profile.currentFocus}
                </p>
              )}
              <p>
                Dengan berkembangnya AI agent, nilai utamaku bukan pada menulis
                kode, melainkan pada kemampuan menemukan masalah yang layak
                diselesaikan, memahami kebutuhan pengguna, memetakan alur
                bisnis, merancang solusi, dan mengarahkan implementasinya.
              </p>
            </div>
          </section>

          <section className="border-t border-line pt-12">
            <p className="text-lg text-ink-secondary leading-relaxed">
              Teknologi akan terus berganti — hari ini AI, besok mungkin yang
              lain. Yang tidak berubah: ketertarikanku pada masalah nyata dan
              bagaimana menyelesaikannya.
            </p>
          </section>

          <section>
            <Eyebrow as="h2" className="block mb-6">
              Terhubung
            </Eyebrow>
            <div className="flex flex-wrap gap-6 text-lg">
              {socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {social.label} ↗
                </a>
              ))}
              <Link href="/writing" className="text-accent hover:underline">
                Baca tulisanku →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </PublicShell>
  );
}
