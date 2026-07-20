import PublicShell from "@/components/PublicShell";
import { PixelWitchSprite } from "@/components/witch/sprites";
import { Eyebrow, MonoLink } from "@/components/ui";

export default function NotFound() {
  return (
    <PublicShell>
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center animate-fade-in-up">
        <div className="mb-10 flex justify-center text-ink">
          <div className="witch-bob">
            <PixelWitchSprite size={96} />
          </div>
        </div>
        <Eyebrow tone="accent" className="mb-4 block">
          404 // Transmission Lost
        </Eyebrow>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-ink">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-6 max-w-prose text-lg leading-relaxed text-ink-secondary">
          Halaman yang kamu cari tidak ada di log misi — mungkin sudah
          dipindahkan, atau memang tidak pernah ada. Witch kami sedang
          menyisir frekuensi lain.
        </p>
        <div className="mt-10 flex justify-center">
          <MonoLink href="/">← Back to Base</MonoLink>
        </div>
      </main>
    </PublicShell>
  );
}
