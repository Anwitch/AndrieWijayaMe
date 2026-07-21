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

  return (
    <section className="flex flex-col md:flex-row items-center md:items-start gap-12 py-16 animate-fade-in-up">
      {/* Foto Profil Lingkaran */}
      <div className="flex-shrink-0">
        <div className="w-48 h-48 md:w-64 md:h-64 overflow-hidden rounded-full border-4 border-line shadow-sm">
          <Image
            src={profile?.avatarUrl ?? "/FotoAndrieGantengKacamata.webp"}
            alt={profile?.avatarAltText ?? settings.siteName}
            width={256}
            height={256}
            preload
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Nama dan Social Icons */}
      <div className="flex flex-col justify-center pt-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <h1 className="text-5xl md:text-6xl font-bold text-ink tracking-tight">
            {settings.siteName}
          </h1>
          {/* Ikon Media Sosial */}
          <div className="flex gap-4">
            {socialLinks(profile).map((social) => (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${settings.siteName} on ${social.label}`}
                className="bg-ink text-paper p-2 rounded-full w-10 h-10 flex items-center justify-center text-xs font-semibold hover:bg-ink-secondary transition-colors"
              >
                {social.short}
              </a>
            ))}
          </div>
        </div>
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
      </div>
    </section>
  );
}
