"use client";

import Link from "next/link";
import { MonoLink } from "@/components/ui";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function Navbar() {
  const settings = useSiteSettings();
  const links = [
    {
      name: settings.navAboutLabel,
      href: "/about",
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
    <nav className="border-b border-line py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="min-w-0 truncate font-mono text-xs font-semibold uppercase tracking-widest text-ink"
        >
          {settings.siteName}
        </Link>
        <div className="flex shrink-0 gap-4 sm:gap-8">
          {links.map((item) => (
            <MonoLink key={item.href} href={item.href}>
              {item.name}
            </MonoLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
