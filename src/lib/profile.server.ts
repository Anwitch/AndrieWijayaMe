import "server-only";

import { cache } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

/**
 * Server-side profile fetch, deduped per request. Returns null on error or when
 * no profile document exists yet, so callers can safely optional-chain.
 */
export const getProfile = cache(async () => {
  try {
    return await fetchQuery(api.profile.get, {});
  } catch {
    return null;
  }
});
