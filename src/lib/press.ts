import type { PressItem } from "./structured-data";

/**
 * Mission-control text format for a project's press list, one item per line:
 * `Publisher | Judul | https://url | YYYY-MM-DD` (the date is optional).
 */
export const PRESS_PLACEHOLDER =
  "Publisher | Judul artikel | https://... | 2026-09-09";

export function formatPressText(press: PressItem[] | undefined) {
  return (press ?? [])
    .map((item) =>
      [item.publisher, item.title, item.url, item.date]
        .filter((part) => part !== undefined)
        .join(" | "),
    )
    .join("\n");
}

/** Throws with a line-specific message when a line is incomplete. */
export function parsePressText(text: string): PressItem[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line, index) => {
      const [publisher, title, url, date] = line
        .split("|")
        .map((part) => part.trim());
      if (!publisher || !title || !url) {
        throw new Error(
          `Press line ${index + 1} must look like: ${PRESS_PLACEHOLDER}`,
        );
      }
      return { publisher, title, url, ...(date ? { date } : {}) };
    });
}
