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

export const MAX_PRESS_ITEMS = 20;

export type PressItem = {
  publisher: string;
  title: string;
  url: string;
  date?: string;
};

export function normalizePress(items: PressItem[]): PressItem[] {
  if (items.length > MAX_PRESS_ITEMS) {
    throw new ConvexError(
      `A project can list at most ${MAX_PRESS_ITEMS} press items.`,
    );
  }
  return items.map((item) => {
    const url = optionalHttpUrl(item.url, "Press URL");
    if (!url) {
      throw new ConvexError("Press URL is required.");
    }
    const date = item.date?.trim();
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new ConvexError("Press date must use the YYYY-MM-DD format.");
    }
    return {
      publisher: requiredText(item.publisher, "Press publisher", 120),
      title: requiredText(item.title, "Press title", 300),
      url,
      ...(date ? { date } : {}),
    };
  });
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
