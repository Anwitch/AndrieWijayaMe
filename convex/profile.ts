import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";
import { limitedText } from "./lib/validation";
import { storageMatchesMedia } from "./lib/media";

const X_HOSTS = new Set(["x.com", "www.x.com", "twitter.com", "www.twitter.com"]);
const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com"]);
const LINKEDIN_HOSTS = new Set(["linkedin.com", "www.linkedin.com"]);
const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);

function validateSocialUrl(
  value: string | undefined,
  label: string,
  allowedHosts: Set<string>,
) {
  const normalized = value?.trim();
  if (!normalized) return normalized;

  try {
    const url = new URL(normalized);
    if (url.protocol !== "https:" || !allowedHosts.has(url.hostname.toLowerCase())) {
      throw new Error();
    }
    return url.toString();
  } catch {
    throw new ConvexError(`${label} must be a valid HTTPS profile URL.`);
  }
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query("profile").unique();
    if (!profile) return null;

    if (!profile.avatarMediaId) {
      return { ...profile, avatarUrl: null, avatarAltText: null };
    }

    const media = await ctx.db.get("media", profile.avatarMediaId);
    if (!media || media.purpose !== "profile-avatar") {
      return { ...profile, avatarUrl: null, avatarAltText: null };
    }
    const metadata = await ctx.db.system.get("_storage", media.storageId);
    if (!metadata || !storageMatchesMedia(metadata, media)) {
      return { ...profile, avatarUrl: null, avatarAltText: null };
    }

    return {
      ...profile,
      avatarUrl: await ctx.storage.getUrl(media.storageId),
      avatarAltText: media.altText || null,
    };
  },
});

export const setAvatar = mutation({
  args: { mediaId: v.union(v.id("media"), v.null()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const profile = await ctx.db.query("profile").unique();

    if (args.mediaId === null) {
      if (profile) {
        await ctx.db.patch("profile", profile._id, {
          avatarMediaId: undefined,
          updatedAt: Date.now(),
        });
      }
      return null;
    }

    const media = await ctx.db.get("media", args.mediaId);
    if (!media) throw new ConvexError("Media not found.");
    if (media.purpose !== "profile-avatar") {
      throw new ConvexError("Only profile avatar media can be selected.");
    }
    const metadata = await ctx.db.system.get("_storage", media.storageId);
    if (!metadata || !storageMatchesMedia(metadata, media)) {
      throw new ConvexError("The selected media file is no longer valid.");
    }

    if (profile) {
      await ctx.db.patch("profile", profile._id, {
        avatarMediaId: media._id,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("profile", {
        bio: "",
        tagline: "",
        location: "",
        status: "",
        avatarMediaId: media._id,
        updatedAt: Date.now(),
      });
    }
    return null;
  },
});

export const update = mutation({
  args: {
    bio: v.optional(v.string()),
    tagline: v.optional(v.string()),
    location: v.optional(v.string()),
    status: v.optional(v.string()),
    specialization: v.optional(v.string()),
    currentFocus: v.optional(v.string()),
    xUrl: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const updates = { ...args };
    if (args.bio !== undefined) {
      updates.bio = limitedText(args.bio, "Bio", 10000);
    }
    if (args.tagline !== undefined) {
      updates.tagline = limitedText(args.tagline, "Tagline", 300);
    }
    if (args.location !== undefined) {
      updates.location = limitedText(args.location, "Location", 160);
    }
    if (args.status !== undefined) {
      updates.status = limitedText(args.status, "Status", 160);
    }
    if (args.specialization !== undefined) {
      updates.specialization = limitedText(
        args.specialization,
        "Specialization",
        300,
      );
    }
    if (args.currentFocus !== undefined) {
      updates.currentFocus = limitedText(
        args.currentFocus,
        "Current focus",
        300,
      );
    }
    if (args.xUrl !== undefined) {
      updates.xUrl = validateSocialUrl(args.xUrl, "X URL", X_HOSTS);
    }
    if (args.instagramUrl !== undefined) {
      updates.instagramUrl = validateSocialUrl(
        args.instagramUrl,
        "Instagram URL",
        INSTAGRAM_HOSTS,
      );
    }
    if (args.linkedinUrl !== undefined) {
      updates.linkedinUrl = validateSocialUrl(
        args.linkedinUrl,
        "LinkedIn URL",
        LINKEDIN_HOSTS,
      );
    }
    if (args.githubUrl !== undefined) {
      updates.githubUrl = validateSocialUrl(
        args.githubUrl,
        "GitHub URL",
        GITHUB_HOSTS,
      );
    }
    const profile = await ctx.db.query("profile").unique();
    if (profile) {
      await ctx.db.patch(profile._id, { ...updates, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("profile", {
        bio: "",
        tagline: "",
        location: "",
        status: "",
        ...updates,
        updatedAt: Date.now(),
      });
    }
  },
});
