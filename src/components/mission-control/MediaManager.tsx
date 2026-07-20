"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, usePaginatedQuery } from "convex/react";
import {
  Check,
  ImageIcon,
  Pencil,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  Button,
  EmptyState,
  FeedbackNote,
  Panel,
  Skeleton,
  inputClass,
  labelClass,
} from "@/components/ui";
import { getErrorMessage } from "@/lib/errors";

const MAX_MEDIA_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const PURPOSES = ["profile-avatar", "project-cover", "post-cover"] as const;
type Purpose = (typeof PURPOSES)[number];

export default function MediaManager() {
  const [filter, setFilter] = useState<Purpose | "all">("all");
  const { results, status, loadMore } = usePaginatedQuery(
    api.media.list,
    { purpose: filter === "all" ? undefined : filter },
    { initialNumItems: 12 },
  );
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const finalizeMedia = useMutation(api.media.finalize);
  const updateAltText = useMutation(api.media.updateAltText);
  const removeMedia = useMutation(api.media.remove);
  const setAvatar = useMutation(api.profile.setAvatar);
  const [file, setFile] = useState<File | null>(null);
  const [purpose, setPurpose] = useState<Purpose>("profile-avatar");
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const chooseFile = (selectedFile: File | undefined) => {
    setError(null);
    setMessage(null);
    if (!selectedFile) {
      setFile(null);
      return;
    }
    if (!ALLOWED_TYPES.has(selectedFile.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (selectedFile.size > MAX_MEDIA_SIZE) {
      setError("Images must be 5 MB or smaller.");
      return;
    }
    setFile(selectedFile);
    if (!altText) setAltText(selectedFile.name.replace(/\.[^.]+$/, ""));
  };

  const uploadMedia = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || isUploading) return;

    setError(null);
    setMessage(null);
    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("Storage upload failed.");

      const body: unknown = await response.json();
      if (
        !body ||
        typeof body !== "object" ||
        !("storageId" in body) ||
        typeof body.storageId !== "string"
      ) {
        throw new Error("Storage returned an invalid upload response.");
      }

      const result = await finalizeMedia({
        storageId: body.storageId as Id<"_storage">,
        originalName: file.name,
        purpose,
        altText,
      });
      if (result.status === "rejected") {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setError(result.reason);
        return;
      }

      setFile(null);
      setAltText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("Media uploaded and validated.");
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "Media upload failed."));
    } finally {
      setIsUploading(false);
    }
  };

  const runAction = async (key: string, action: () => Promise<unknown>) => {
    if (pendingAction) return;
    setError(null);
    setMessage(null);
    setPendingAction(key);
    try {
      await action();
    } catch (actionError) {
      setError(getErrorMessage(actionError, "Media operation failed."));
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <Panel
      id="media-library"
      size="lg"
      icon={<ImageIcon size={20} className="text-ink-muted" />}
      title="Media Library"
      subtitle="Convex Storage // JPEG, PNG, WebP // 5 MB max"
      aside={
        <label className={`flex items-center gap-3 ${labelClass}`}>
          Filter
          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as Purpose | "all")
            }
            className={`${inputClass} w-auto text-ink`}
          >
            <option value="all">All purposes</option>
            {PURPOSES.map((item) => (
              <option key={item} value={item}>
                {formatPurpose(item)}
              </option>
            ))}
          </select>
        </label>
      }
    >
      <form
        onSubmit={uploadMedia}
        className="mb-8 grid gap-5 border border-dashed border-line-strong bg-surface p-4 sm:p-6 lg:grid-cols-[180px_1fr]"
      >
        <div className="relative aspect-square overflow-hidden border border-line bg-paper">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Selected upload preview"
              fill
              unoptimized
              sizes="180px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-faint">
              <Upload size={28} />
              <span className="font-mono text-xs uppercase tracking-widest">
                Preview
              </span>
            </div>
          )}
        </div>
        <div className="grid content-start gap-4 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <span className={labelClass}>Image file</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isUploading}
              onChange={(event) => chooseFile(event.target.files?.[0])}
              className="block w-full rounded-sm border border-line-strong bg-paper p-2 text-xs file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-2 file:font-mono file:text-xs file:uppercase file:tracking-widest file:text-paper"
            />
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Purpose</span>
            <select
              value={purpose}
              disabled={isUploading}
              onChange={(event) => setPurpose(event.target.value as Purpose)}
              className={inputClass}
            >
              {PURPOSES.map((item) => (
                <option key={item} value={item}>
                  {formatPurpose(item)}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className={labelClass}>Alt text</span>
            <input
              value={altText}
              maxLength={300}
              disabled={isUploading}
              onChange={(event) => setAltText(event.target.value)}
              className={inputClass}
              placeholder="Describe the image"
            />
          </label>
          <div className="flex items-center justify-between gap-4 sm:col-span-2">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              {file ? `${file.type} // ${formatBytes(file.size)}` : "No file selected"}
            </span>
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? "Uploading..." : "Upload media"}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <FeedbackNote tone="error" className="mb-6">
          {error}
        </FeedbackNote>
      )}
      {message && (
        <FeedbackNote tone="success" className="mb-6">
          {message}
        </FeedbackNote>
      )}

      {status === "LoadingFirstPage" ? (
        <div
          className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="Loading media"
        >
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="aspect-[4/5]" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState>No media in this channel.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((media) => (
            <MediaCard
              key={media._id}
              media={media}
              pendingAction={pendingAction}
              onSaveAlt={(value) =>
                runAction(`alt-${media._id}`, () =>
                  updateAltText({ mediaId: media._id, altText: value }),
                )
              }
              onUseAsAvatar={() =>
                runAction(`avatar-${media._id}`, () =>
                  setAvatar({ mediaId: media._id }),
                )
              }
              onDelete={() => {
                if (!window.confirm(`Delete ${media.originalName} permanently?`))
                  return;
                void runAction(`delete-${media._id}`, () =>
                  removeMedia({ mediaId: media._id }),
                );
              }}
            />
          ))}
        </div>
      )}

      {(status === "CanLoadMore" || status === "LoadingMore") && (
        <Button
          type="button"
          variant="outline"
          disabled={status === "LoadingMore"}
          onClick={() => loadMore(12)}
          className="mt-8 w-full"
        >
          {status === "LoadingMore" ? "Loading..." : "Load more media"}
        </Button>
      )}
    </Panel>
  );
}

type MediaItem = ReturnType<typeof usePaginatedQuery<typeof api.media.list>>["results"][number];

function MediaCard({
  media,
  pendingAction,
  onSaveAlt,
  onUseAsAvatar,
  onDelete,
}: {
  media: MediaItem;
  pendingAction: string | null;
  onSaveAlt: (value: string) => Promise<void>;
  onUseAsAvatar: () => Promise<void>;
  onDelete: () => void;
}) {
  const [isEditingAlt, setIsEditingAlt] = useState(false);
  const [altText, setAltText] = useState(media.altText);
  const isPending = pendingAction?.endsWith(media._id) ?? false;

  return (
    <article className="overflow-hidden rounded-sm border border-line bg-paper">
      <div className="relative aspect-square bg-surface">
        {media.url ? (
          <Image
            src={media.url}
            alt={media.altText || "Media preview"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-widest text-ink-muted">
            File unavailable
          </div>
        )}
        <span className="absolute left-2 top-2 bg-ink/85 px-2 py-1 font-mono text-xs uppercase tracking-widest text-paper">
          {formatPurpose(media.purpose)}
        </span>
        {media.isInUse && (
          <span className="absolute right-2 top-2 bg-paper px-2 py-1 font-mono text-xs uppercase tracking-widest text-ink shadow-sm">
            In use
          </span>
        )}
      </div>
      <div className="space-y-4 p-4">
        <div>
          <p className="truncate text-sm font-semibold" title={media.originalName}>
            {media.originalName}
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-ink-faint">
            {media.contentType.replace("image/", "")} {" // "}
            {formatBytes(media.size)}
          </p>
        </div>

        {isEditingAlt ? (
          <div className="space-y-2">
            <textarea
              value={altText}
              maxLength={300}
              disabled={isPending}
              onChange={(event) => setAltText(event.target.value)}
              aria-label={`Alt text for ${media.originalName}`}
              rows={3}
              className="w-full rounded-sm border border-line-strong p-2 text-xs outline-none transition-colors focus:border-ink"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setAltText(media.altText);
                  setIsEditingAlt(false);
                }}
                className="p-2 text-ink-muted hover:text-ink"
                aria-label="Cancel alt text edit"
              >
                <X size={14} />
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  void onSaveAlt(altText).then(() => setIsEditingAlt(false))
                }
                className="bg-ink p-2 text-paper disabled:bg-ink-faint"
                aria-label="Save alt text"
              >
                <Check size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditingAlt(true)}
            className="flex min-h-10 w-full items-start justify-between gap-3 border-l-2 border-line pl-3 text-left text-xs text-ink-muted hover:border-ink hover:text-ink"
          >
            <span className="line-clamp-2">{media.altText || "No alt text"}</span>
            <Pencil size={12} className="mt-0.5 shrink-0" />
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          {media.purpose === "profile-avatar" && (
            <button
              type="button"
              disabled={isPending || media.isInUse || !media.url}
              onClick={() => void onUseAsAvatar()}
              className="flex items-center justify-center gap-2 rounded-sm border border-line px-2 py-2 font-mono text-xs uppercase tracking-widest hover:border-ink disabled:bg-surface disabled:text-ink-faint"
            >
              <UserRound size={13} />
              {media.isInUse ? "Active" : "Use avatar"}
            </button>
          )}
          <button
            type="button"
            disabled={isPending || media.isInUse}
            onClick={onDelete}
            className={`${media.purpose === "profile-avatar" ? "" : "col-span-2"} flex items-center justify-center gap-2 rounded-sm border border-danger-line px-2 py-2 font-mono text-xs uppercase tracking-widest text-danger hover:border-danger disabled:bg-surface disabled:text-ink-faint`}
            title={media.isInUse ? "Detach this media before deleting it" : undefined}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function formatPurpose(purpose: Purpose) {
  return purpose.replace("-", " ");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
