import { SITE_URL } from "./site-url";
import type { SiteSettings } from "./site-settings";

const PROFILE_IMAGE = `${SITE_URL}/FotoAndrieGantengKacamata.webp`;

/**
 * schema.org Person — the primary entity for a personal brand. Helps search and
 * AI engines resolve "who is Andrie Wijaya" and cite him accurately.
 */
export function personSchema(settings: SiteSettings, sameAs: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: settings.siteName,
    url: SITE_URL,
    image: PROFILE_IMAGE,
    jobTitle: "Product Thinker & Problem Solver",
    description: settings.seoDescription,
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
