import { v } from "convex/values";

export const MAX_MEDIA_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const mediaPurposeValidator = v.union(
  v.literal("profile-avatar"),
  v.literal("project-cover"),
  v.literal("post-cover"),
);

export type StorageImageMetadata = {
  contentType?: string;
  size: number;
};

export function getStorageImageError(metadata: StorageImageMetadata) {
  if (metadata.size <= 0) {
    return "The uploaded image is empty.";
  }
  if (metadata.size > MAX_MEDIA_SIZE) {
    return "Images must be 5 MB or smaller.";
  }
  if (
    !metadata.contentType ||
    !ALLOWED_IMAGE_TYPES.includes(
      metadata.contentType.toLowerCase() as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    return "Only JPEG, PNG, and WebP images are allowed.";
  }
  return null;
}

export function storageMatchesMedia(
  metadata: StorageImageMetadata,
  media: { contentType: string; size: number },
) {
  return (
    getStorageImageError(metadata) === null &&
    metadata.size === media.size &&
    metadata.contentType?.toLowerCase() === media.contentType
  );
}
