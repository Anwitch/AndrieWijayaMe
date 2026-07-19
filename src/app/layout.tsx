import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
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

export const metadata: Metadata = {
  title: "Andrie Wijaya | Software Developer",
  description:
    "Digital Journal of Andrie Wijaya, a Software Developer based in Pontianak, Indonesia.",
};

import { ConvexClientProvider } from "@/components/ConvexClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans antialiased min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]`}
      >
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
