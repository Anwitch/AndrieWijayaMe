import "server-only";

import { cache } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { DEFAULT_SITE_SETTINGS } from "./site-settings";

export const getSiteSettings = cache(async () => {
  try {
    return await fetchQuery(api.siteSettings.get, {});
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
});
