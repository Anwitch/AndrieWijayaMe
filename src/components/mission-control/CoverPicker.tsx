"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Eyebrow } from "@/components/ui";
import type { Id } from "../../../convex/_generated/dataModel";

/**
 * Lets an admin pick a cover image from already-uploaded media of a given
 * purpose. `value` is the currently-selected media id (or undefined); onChange
 * receives a media id or null (no cover).
 */
export default function CoverPicker({
  purpose,
  value,
  onChange,
  disabled = false,
}: {
  purpose: "project-cover" | "post-cover";
  value: Id<"media"> | undefined;
  onChange: (mediaId: Id<"media"> | null) => void;
  disabled?: boolean;
}) {
  const { results, status } = usePaginatedQuery(
    api.media.list,
    { purpose },
    { initialNumItems: 30 },
  );

  const covers = results.filter((media) => media !== null && Boolean(media.url));

  return (
    <div className="space-y-2">
      <Eyebrow as="div">Cover</Eyebrow>
      {status === "LoadingFirstPage" ? (
        <div className="text-xs font-mono text-ink-faint">Loading covers…</div>
      ) : covers.length === 0 ? (
        <div className="text-xs font-mono text-ink-faint">
          No cover images yet — upload one in the Media Library (cover purpose).
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(null)}
            className={`h-14 rounded-sm border px-2 font-mono text-[10px] uppercase tracking-widest transition-colors disabled:opacity-40 ${
              value === undefined
                ? "bg-ink text-paper border-ink"
                : "border-line bg-paper text-ink-muted hover:border-ink"
            }`}
          >
            None
          </button>
          {covers.map((media) => (
            <button
              key={media._id}
              type="button"
              disabled={disabled}
              title={media.altText || media.originalName}
              onClick={() => onChange(media._id)}
              className={`h-14 w-20 overflow-hidden rounded-sm border-2 transition-colors disabled:opacity-40 ${
                value === media._id
                  ? "border-ink"
                  : "border-line hover:border-ink"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.url ?? ""}
                alt={media.altText || "cover option"}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
