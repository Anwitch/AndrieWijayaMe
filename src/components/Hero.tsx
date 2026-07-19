"use client";

import Image from "next/image";
import EditableText from "./EditableText";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Hero({ isPublic = false }: { isPublic?: boolean }) {
  const profile = useQuery(api.profile.get);
  const updateProfile = useMutation(api.profile.update);

  const defaultTagline =
    "Software Developer dan Tech Enthusiast yang berbasis di Pontianak, Kalimantan Barat.";

  return (
    <section className="flex flex-col md:flex-row items-center md:items-start gap-12 py-16 animate-fade-in-up">
      {/* Foto Profil Lingkaran */}
      <div className="flex-shrink-0">
        <div className="w-48 h-48 md:w-64 md:h-64 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm">
          <Image
            src="/FotoAndrieGantengKacamata.webp"
            alt="Andrie Wijaya"
            width={256}
            height={256}
            priority
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Nama dan Social Icons */}
      <div className="flex flex-col justify-center pt-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tight">
            Andrie Wijaya
          </h1>
          {/* Ikon Media Sosial */}
          <div className="flex gap-4">
            {profile?.xUrl && (
              <a
                href={profile.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Andrie Wijaya on X"
                className="bg-black text-white p-2 rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                X
              </a>
            )}
            {profile?.instagramUrl && (
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Andrie Wijaya on Instagram"
                className="bg-black text-white p-2 rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                IG
              </a>
            )}
          </div>
        </div>
        <div className="text-xl md:text-2xl text-gray-600 mt-6 leading-relaxed max-w-2xl">
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
