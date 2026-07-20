"use client";

import Link from "next/link";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function Navbar() {
  const settings = useSiteSettings();
  const links = [
    {
      name: settings.navAboutLabel,
      href: "/#ringkasan",
      visible: settings.navAboutVisible,
    },
    {
      name: settings.navProjectsLabel,
      href: "/projects",
      visible: settings.navProjectsVisible,
    },
    {
      name: settings.navWritingLabel,
      href: "/writing",
      visible: settings.navWritingVisible,
    },
  ].filter((item) => item.visible);

  return (
    <nav className="border-b border-gray-100 py-4">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center gap-6">
        <Link
          href="/"
          className="min-w-0 truncate font-mono text-xs uppercase tracking-[0.2em] font-bold"
        >
          {settings.siteName}
        </Link>
        <div className="flex shrink-0 gap-3 sm:gap-8">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[10px] uppercase tracking-wider font-semibold text-gray-600 hover:text-black transition-colors sm:text-xs sm:tracking-widest"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
