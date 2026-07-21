import { SITE_URL } from "./site-url";
import type { SiteSettings } from "./site-settings";

const PROFILE_IMAGE = `${SITE_URL}/FotoAndrieGantengKacamata.webp`;

/**
 * schema.org Person — the primary entity for a personal brand. Helps search and
 * AI engines resolve "who is Andrie Wijaya" and cite him accurately.
 */
export function personSchema(
  settings: SiteSettings,
  sameAs: string[] = [],
  image = PROFILE_IMAGE,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: settings.siteName,
    alternateName: "Anwitch",
    url: SITE_URL,
    image,
    email: "mailto:andrie.wijaya.contact@gmail.com",
    jobTitle: "Product Thinker & Problem Solver",
    description: settings.seoDescription,
    nationality: { "@type": "Country", name: "Indonesia" },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Universitas Tanjungpura",
      sameAs: "https://untan.ac.id",
    },
    affiliation: {
      "@type": "Organization",
      name: "HMIF FT UNTAN",
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Product Thinker & Problem Solver",
      occupationLocation: { "@type": "City", name: "Pontianak" },
    },
    knowsAbout: [
      "Problem Solving",
      "Product Thinking",
      "Transformasi Digital",
      "Otomasi Proses Bisnis",
      "Artificial Intelligence",
      "Desain Produk Digital",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pontianak",
      addressRegion: "Kalimantan Barat",
      addressCountry: "ID",
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** schema.org BreadcrumbList — helps engines show the page's place in the site. */
export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** schema.org WebSite — declares the site identity and default language. */
export function webSiteSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: settings.siteName,
    url: SITE_URL,
    description: settings.seoDescription,
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE_URL}/#person` },
  };
}
