import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/site-url";
import { breadcrumbSchema } from "@/lib/structured-data";

const title = "Tulisan";
const description =
  "Catatan lapangan: proses memahami masalah dunia nyata dan merancang solusi digital. Bukan tutorial teknologi — dokumentasi cara berpikir.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/writing" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/writing`,
    title: `${title} | Andrie Wijaya`,
    description,
  },
  twitter: { card: "summary_large_image", title: `${title} | Andrie Wijaya`, description },
};

export default function WritingLayout({ children }: { children: ReactNode }) {
  const breadcrumb = breadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Tulisan", path: "/writing" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
