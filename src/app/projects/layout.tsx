import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/site-url";
import { breadcrumbSchema } from "@/lib/structured-data";

const title = "Proyek";
const description =
  "Arsip proyek, eksperimen, dan solusi digital yang dirancang dari masalah nyata — dari pemetaan proses hingga implementasi.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/projects`,
    title: `${title} | Andrie Wijaya`,
    description,
  },
  twitter: { card: "summary_large_image", title: `${title} | Andrie Wijaya`, description },
};

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  const breadcrumb = breadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Proyek", path: "/projects" },
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
