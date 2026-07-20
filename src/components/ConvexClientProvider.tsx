"use client";

import { ReactNode } from "react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import type { SiteSettings } from "@/lib/site-settings";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
  children,
  initialSiteSettings,
}: {
  children: ReactNode;
  initialSiteSettings: SiteSettings;
}) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <SiteSettingsProvider initialSettings={initialSiteSettings}>
        {children}
      </SiteSettingsProvider>
    </ConvexAuthNextjsProvider>
  );
}
