"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { SiteSettings } from "@/lib/site-settings";

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: SiteSettings;
}) {
  const settings = useQuery(api.siteSettings.get) ?? initialSettings;

  return (
    <SiteSettingsContext value={settings}>{children}</SiteSettingsContext>
  );
}

export function useSiteSettings() {
  const settings = useContext(SiteSettingsContext);
  if (!settings) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider.");
  }
  return settings;
}
