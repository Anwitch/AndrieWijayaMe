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
    <section
      id="media-library"
      className="scroll-mt-8 border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <ImageIcon size={20} className="text-gray-400" />
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              Media Library
            </h2>
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-gray-400">
            Convex Storage // JPEG, PNG, WebP // 5 MB max
          </p>
        </div>
        <label className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-gray-500">
          Filter
          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as Purpose | "all")
            }
            className="border border-gray-200 bg-white px-3 py-2 text-black outline-none focus:border-black"
          >
            <option value="all">All purposes</option>
            {PURPOSES.map((item) => (
              <option key={item} value={item}>
                {formatPurpose(item)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form
        onSubmit={uploadMedia}
        className="mb-8 grid gap-5 border border-dashed border-gray-300 bg-gray-50 p-4 sm:p-6 lg:grid-cols-[180px_1fr]"
      >
        <div className="relative aspect-square overflow-hidden border border-gray-200 bg-white">
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
            <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-300">
              <Upload size={28} />
              <span className="font-mono text-[9px] uppercase tracking-widest">
                Preview
              </span>
            </div>
          )}
        </div>
        <div className="grid content-start gap-4 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
              Image file
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isUploading}
              onChange={(event) => chooseFile(event.target.files?.[0])}
              className="block w-full border border-gray-200 bg-white p-2 text-xs file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:font-mono file:text-[10px] file:uppercase file:tracking-widest file:text-white"
            />
          </label>
          <label className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
              Purpose
            </span>
            <select
              value={purpose}
              disabled={isUploading}
              onChange={(event) => setPurpose(event.target.value as Purpose)}
              className="w-full border border-gray-200 bg-white p-2 text-sm outline-none focus:border-black"
            >
              {PURPOSES.map((item) => (
                <option key={item} value={item}>
                  {formatPurpose(item)}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
              Alt text
            </span>
            <input
              value={altText}
              maxLength={300}
              disabled={isUploading}
              onChange={(event) => setAltText(event.target.value)}
              className="w-full border border-gray-200 bg-white p-2 text-sm outline-none focus:border-black"
              placeholder="Describe the image"
            />
          </label>
          <div className="flex items-center justify-between gap-4 sm:col-span-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
              {file ? `${file.type} // ${formatBytes(file.size)}` : "No file selected"}
            </span>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="bg-black px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-white hover:bg-gray-800 disabled:bg-gray-300"
            >
              {isUploading ? "Uploading..." : "Upload media"}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <p role="alert" className="mb-6 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mb-6 border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {status === "LoadingFirstPage" ? (
        <div className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading media">
          {[1, 2, 3].map((item) => (
            <div key={item} className="aspect-[4/5] bg-gray-50" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="border-2 border-dashed border-gray-100 py-20 text-center font-mono text-xs uppercase tracking-widest text-gray-400">
          No media in this channel.
        </div>
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
        <button
          type="button"
          disabled={status === "LoadingMore"}
          onClick={() => loadMore(12)}
          className="mt-8 w-full border border-gray-200 py-3 font-mono text-[10px] uppercase tracking-widest hover:border-black disabled:text-gray-300"
        >
          {status === "LoadingMore" ? "Loading..." : "Load more media"}
        </button>
      )}
    </section>
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
    <article className="overflow-hidden border border-gray-200 bg-white">
      <div className="relative aspect-square bg-gray-100">
        {media.url ? (
          <Image
            src={media.url}
            alt={media.altText || "Media preview"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-widest text-gray-400">
            File unavailable
          </div>
        )}
        <span className="absolute left-2 top-2 bg-black/85 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-white">
          {formatPurpose(media.purpose)}
        </span>
        {media.isInUse && (
          <span className="absolute right-2 top-2 bg-white px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-black shadow-sm">
            In use
          </span>
        )}
      </div>
      <div className="space-y-4 p-4">
        <div>
          <p className="truncate text-sm font-semibold" title={media.originalName}>
            {media.originalName}
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-gray-400">
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
              className="w-full border border-gray-200 p-2 text-xs outline-none focus:border-black"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setAltText(media.altText);
                  setIsEditingAlt(false);
                }}
                className="p-2 text-gray-500 hover:text-black"
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
                className="bg-black p-2 text-white disabled:bg-gray-300"
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
            className="flex min-h-10 w-full items-start justify-between gap-3 border-l-2 border-gray-100 pl-3 text-left text-xs text-gray-500 hover:border-black hover:text-black"
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
              className="flex items-center justify-center gap-2 border border-gray-200 px-2 py-2 font-mono text-[9px] uppercase tracking-widest hover:border-black disabled:bg-gray-50 disabled:text-gray-300"
            >
              <UserRound size={13} />
              {media.isInUse ? "Active" : "Use avatar"}
            </button>
          )}
          <button
            type="button"
            disabled={isPending || media.isInUse}
            onClick={onDelete}
            className={`${media.purpose === "profile-avatar" ? "" : "col-span-2"} flex items-center justify-center gap-2 border border-red-100 px-2 py-2 font-mono text-[9px] uppercase tracking-widest text-red-600 hover:border-red-500 disabled:bg-gray-50 disabled:text-gray-300`}
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
