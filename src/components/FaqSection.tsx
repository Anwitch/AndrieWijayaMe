import { SITE_URL } from "@/lib/site-url";
import { SectionHeading } from "@/components/ui";

/**
 * Static FAQ in the brand voice (problem solver / product thinker). Content is
 * hardcoded so it is server-rendered into the initial HTML — readable by search
 * and AI crawlers. The FAQPage JSON-LD must mirror the visible text exactly
 * (a Google requirement for rich results).
 */
const FAQ_ITEMS = [
  {
    question: "Siapa Andrie Wijaya?",
    answer:
      "Andrie Wijaya adalah seorang product thinker dan problem solver yang berbasis di Pontianak, Kalimantan Barat. Ia mendokumentasikan proses memahami masalah dunia nyata — dari observasi hingga akar penyebabnya — lalu merancang bagaimana teknologi dapat menyelesaikannya. Baginya, teknologi hanyalah alat — yang lebih penting adalah memastikan masalahnya benar-benar selesai.",
  },
  {
    question: "Apa yang dikerjakan Andrie Wijaya?",
    answer:
      "Andrie menemukan masalah yang layak diselesaikan, memahami kebutuhan pengguna, memetakan alur bisnis, merancang solusi digital, lalu mengarahkan implementasinya — termasuk dengan memanfaatkan AI agent. Fokusnya bukan pada satu teknologi tertentu, melainkan pada transformasi digital dari proses yang tidak efisien.",
  },
  {
    question: "Bagaimana cara Andrie mendekati sebuah masalah?",
    answer:
      "Selalu diawali rasa ingin tahu, bukan solusi. Pertanyaan pertamanya bukan “teknologi apa yang bisa dipakai?” melainkan “kenapa proses ini masih seperti ini?”. Dari situ ia mencari tahu proses bisnis sebenarnya melalui observasi atau wawancara, memahami mengapa solusi belum diterapkan, baru kemudian merancang kemungkinan solusi digitalnya.",
  },
  {
    question: "Apakah Andrie Wijaya terbuka untuk kolaborasi?",
    answer:
      "Ya. Andrie terbuka untuk kolaborasi dan proyek yang berangkat dari masalah nyata — terutama digitalisasi dan otomasi proses bisnis. Ia dapat dihubungi melalui tautan sosial di situs ini, anwitch.me.",
  },
];

function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export default function FaqSection() {
  return (
    <section id="faq" className="mt-24 scroll-mt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema()) }}
      />
      <SectionHeading title="Tanya Jawab" aside="FAQ" />

      <dl className="grid grid-cols-1 gap-10">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="border-b border-line pb-8 last:border-0"
          >
            <dt className="text-2xl font-semibold text-ink mb-3">
              {item.question}
            </dt>
            <dd className="text-lg text-ink-secondary leading-relaxed max-w-prose">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
