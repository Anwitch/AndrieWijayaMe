"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { ImageIcon, X } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { Eyebrow, FeedbackNote } from "@/components/ui";
import { getErrorMessage } from "@/lib/errors";

type Profile = FunctionReturnType<typeof api.profile.get>;

export default function ProfileImageEditor({ profile }: { profile: Profile }) {
  const setAvatar = useMutation(api.profile.setAvatar);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const avatarUrl =
    profile?.avatarUrl ?? "/FotoAndrieGantengKacamata.webp";

  const removeAvatar = async () => {
    setError(null);
    setIsRemoving(true);
    try {
      await setAvatar({ mediaId: null });
    } catch (removeError) {
      setError(getErrorMessage(removeError, "Failed to detach profile image."));
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-3">
      <Eyebrow as="div">Profile Image</Eyebrow>
      <div className="flex items-center gap-4 border border-line bg-surface p-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-paper bg-surface shadow-sm">
          <Image
            src={avatarUrl}
            alt={profile?.avatarAltText ?? "Current profile image"}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <Eyebrow as="div" className="flex items-center gap-2">
            <ImageIcon size={13} />
            {profile?.avatarMediaId ? "Storage media" : "Legacy fallback"}
          </Eyebrow>
          <p className="mt-2 line-clamp-2 text-xs text-ink-muted">
            {profile?.avatarAltText ||
              "Select an uploaded avatar from the Media Library."}
          </p>
          <a
            href="#media-library"
            className="mt-2 inline-block font-mono text-xs uppercase tracking-widest text-ink underline underline-offset-4"
          >
            Open library
          </a>
        </div>
      </div>

      {profile?.avatarMediaId && (
        <button
          type="button"
          onClick={() => void removeAvatar()}
          disabled={isRemoving}
          className="flex w-full items-center justify-center gap-2 border border-line px-3 py-2 font-mono text-xs uppercase tracking-widest text-ink-muted hover:border-ink hover:text-ink disabled:opacity-50"
        >
          <X size={13} />
          {isRemoving ? "Detaching..." : "Use legacy fallback"}
        </button>
      )}
      {error && <FeedbackNote tone="error">{error}</FeedbackNote>}
    </div>
  );
}
