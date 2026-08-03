import type { QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

/**
 * Resolves a cover media id to a public storage URL, validating that the
 * referenced media document exists and has the expected purpose. Returns
 * undefined when there is no cover or it is invalid, so public queries can
 * safely spread the result without leaking internal ids.
 */
export async function resolveCoverUrl(
  ctx: Pick<QueryCtx, "db" | "storage">,
  coverMediaId: Id<"media"> | undefined,
  purpose: "project-cover" | "post-cover",
): Promise<string | undefined> {
  if (!coverMediaId) return undefined;
  const media = await ctx.db.get("media", coverMediaId);
  if (!media || media.purpose !== purpose) return undefined;
  const url = await ctx.storage.getUrl(media.storageId);
  return url ?? undefined;
}
