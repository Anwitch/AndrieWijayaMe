import { ConvexError } from "convex/values";

export function requiredText(
  value: string,
  label: string,
  maxLength: number,
) {
  const normalized = value.trim();
  if (!normalized) {
    throw new ConvexError(`${label} is required.`);
  }
  if (normalized.length > maxLength) {
    throw new ConvexError(
      `${label} must be ${maxLength} characters or fewer.`,
    );
  }
  return normalized;
}

export function limitedText(
  value: string,
  label: string,
  maxLength: number,
) {
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new ConvexError(
      `${label} must be ${maxLength} characters or fewer.`,
    );
  }
  return normalized;
}

export function canonicalSlug(value: string) {
  const slug = requiredText(value, "Slug", 120).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new ConvexError(
      "Slug may only contain lowercase letters, numbers, and single hyphens.",
    );
  }
  return slug;
}

export function optionalHttpUrl(value: string | undefined, label: string) {
  const normalized = value?.trim();
  if (!normalized) return undefined;
  if (normalized.length > 2048) {
    throw new ConvexError(`${label} must be 2048 characters or fewer.`);
  }

  try {
    const url = new URL(normalized);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error();
    }
    return normalized;
  } catch {
    throw new ConvexError(`${label} must be a valid HTTP or HTTPS URL.`);
  }
}
