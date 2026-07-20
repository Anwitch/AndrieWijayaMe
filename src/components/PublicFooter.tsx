"use client";

import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function PublicFooter() {
  const settings = useSiteSettings();

  return (
    <footer className="mt-24 border-t border-line py-12">
      <div className="mx-auto max-w-6xl px-6 text-center font-mono text-xs uppercase tracking-widest text-ink-muted">
        &copy; <span suppressHydrationWarning>{new Date().getUTCFullYear()}</span>{" "}
        {settings.siteName}
        {settings.footerText ? ` // ${settings.footerText}` : ""}
      </div>
    </footer>
  );
}
