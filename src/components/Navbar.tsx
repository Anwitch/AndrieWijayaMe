"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MonoLink } from "@/components/ui";
import { WITCH_FLY_EVENT } from "@/components/witch/WitchWorld";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function Navbar() {
  const settings = useSiteSettings();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const last = lastScrollY.current;
      if (y < 80 || y < last - 4) {
        setHidden(false);
      } else if (y > last + 4) {
        setHidden(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
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
    <nav
      className={`sticky top-0 z-50 border-b border-line bg-paper/90 py-4 backdrop-blur-sm transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          onClick={() => window.dispatchEvent(new Event(WITCH_FLY_EVENT))}
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
