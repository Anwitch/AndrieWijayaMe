import { SITE_URL } from "@/lib/site-url";

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
    <section id="faq" className="mt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema()) }}
      />
      <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
        <h2 className="text-4xl font-bold">Tanya Jawab</h2>
        <span className="font-mono text-xs text-gray-400 uppercase tracking-widest hidden md:block">
          FAQ
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-10">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="border-b border-gray-100 pb-8 last:border-0"
          >
            <dt className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
              {item.question}
            </dt>
            <dd className="text-lg text-gray-600 leading-relaxed max-w-prose">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
