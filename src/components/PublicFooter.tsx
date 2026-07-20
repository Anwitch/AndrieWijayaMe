"use client";

import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function PublicFooter() {
  const settings = useSiteSettings();

  return (
    <footer className="mt-24 border-t border-[var(--border-default)] py-12">
      <div className="mx-auto max-w-6xl px-6 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] sm:text-xs">
        &copy; <span suppressHydrationWarning>{new Date().getUTCFullYear()}</span>{" "}
        {settings.siteName}
        {settings.footerText ? ` // ${settings.footerText}` : ""}
      </div>
    </footer>
  );
}
