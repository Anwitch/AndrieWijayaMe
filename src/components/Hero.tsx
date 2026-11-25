"use client";

import Image from "next/image";
import EditableText from "./EditableText";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "../../convex/_generated/api";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { socialLinks } from "@/lib/social-links";

export default function Hero({
  profile,
  isPublic = false,
}: {
  profile: FunctionReturnType<typeof api.profile.get>;
  isPublic?: boolean;
}) {
  const settings = useSiteSettings();
  const updateProfile = useMutation(api.profile.update);

  const defaultTagline =
    "Problem solver dan product thinker yang berbasis di Pontianak, Kalimantan Barat.";
  const socials = socialLinks(profile);

  return (
    <section className="flex flex-col md:flex-row items-center md:items-start gap-12 py-16 animate-fade-in-up">
      {/* Foto Profil Kotak */}
      <div className="flex-shrink-0">
        <div className="relative w-48 aspect-[3/4] md:w-60 overflow-hidden rounded-sm border border-line shadow-sm bg-surface">
          <Image
            src={profile?.avatarUrl ?? "/FotoAndrieGantengKacamata.webp"}
            alt={profile?.avatarAltText ?? settings.siteName}
            width={360}
            height={480}
            preload
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
        </div>
      </div>

      {/* Identitas dan kontak */}
      <div className="flex flex-col justify-center pt-4 w-full">
        <h1
          data-witch-text
          className="text-4xl md:text-5xl lg:text-6xl font-semibold text-ink tracking-tight"
        >
          {settings.siteName}
        </h1>
        <div className="text-lg text-ink-secondary mt-6 leading-relaxed max-w-2xl">
          {isPublic ? (
            (profile?.tagline ?? defaultTagline)
          ) : (
            <EditableText
              label="Tagline"
              value={profile?.tagline ?? defaultTagline}
              onSave={async (newValue) => {
                await updateProfile({ tagline: newValue });
              }}
            />
          )}
        </div>
        {socials.length > 0 && (
          <nav
            aria-label="Kontak dan profil sosial"
            className="mt-8 flex flex-wrap gap-3"
          >
            {socials.map((social) => (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center justify-center rounded-sm border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
                  social.key === "linkedinUrl"
                    ? "border-ink bg-ink text-paper hover:bg-ink-secondary"
                    : "border-line text-ink hover:bg-surface"
                }`}
              >
                {social.key === "linkedinUrl"
                  ? "Hubungi saya di LinkedIn"
                  : social.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
