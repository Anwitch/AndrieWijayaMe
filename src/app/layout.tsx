import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { getSiteSettings } from "@/lib/site-settings.server";
import { getProfile } from "@/lib/profile.server";
import { SITE_URL } from "@/lib/site-url";
import { personSchema, webSiteSchema } from "@/lib/structured-data";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.seoTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.seoDescription,
    applicationName: settings.siteName,
    authors: [{ name: settings.siteName, url: SITE_URL }],
    creator: settings.siteName,
    publisher: settings.siteName,
    keywords: [
      "Andrie Wijaya",
      "problem solver",
      "product thinker",
      "transformasi digital",
      "otomasi proses bisnis",
      "desain solusi digital",
      "AI",
      "Pontianak",
    ],
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": [
          { url: "/feed.xml", title: `${settings.siteName} — Tulisan` },
        ],
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: SITE_URL,
      siteName: settings.siteName,
      title: settings.seoTitle,
      description: settings.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

import { ConvexClientProvider } from "@/components/ConvexClientProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, profile] = await Promise.all([
    getSiteSettings(),
    getProfile(),
  ]);
  const sameAs = [profile?.xUrl, profile?.instagramUrl].filter(
    (url): url is string => Boolean(url),
  );
  const jsonLd = [
    personSchema(siteSettings, sameAs, profile?.avatarUrl ?? undefined),
    webSiteSchema(siteSettings),
  ];

  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans antialiased min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider initialSiteSettings={siteSettings}>
            {children}
          </ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
