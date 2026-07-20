import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";
import {
  getStorageImageError,
  mediaPurposeValidator,
  storageMatchesMedia,
} from "./lib/media";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const finalize = mutation({
  args: {
    storageId: v.id("_storage"),
    originalName: v.string(),
    purpose: mediaPurposeValidator,
    altText: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    const existing = await ctx.db
      .query("media")
      .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
      .unique();
    if (existing) {
      throw new ConvexError("This upload has already been finalized.");
    }

    const metadata = await ctx.db.system.get("_storage", args.storageId);
    if (!metadata) {
      throw new ConvexError("The uploaded file no longer exists.");
    }

    const originalName = args.originalName.trim();
    const altText = args.altText.trim();
    const rejectionReason =
      (!originalName && "Original file name is required.") ||
      (originalName.length > 255 &&
        "Original file name must be 255 characters or fewer.") ||
      (altText.length > 300 && "Alt text must be 300 characters or fewer.") ||
      getStorageImageError(metadata);

    if (rejectionReason) {
      await ctx.storage.delete(args.storageId);
      return { status: "rejected" as const, reason: rejectionReason };
    }

    const now = Date.now();
    const mediaId = await ctx.db.insert("media", {
      storageId: args.storageId,
      originalName,
      contentType: metadata.contentType!.toLowerCase(),
      size: metadata.size,
      purpose: args.purpose,
      altText,
      uploadedBy: user._id,
      createdAt: now,
      updatedAt: now,
    });
    return { status: "created" as const, mediaId };
  },
});

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    purpose: v.optional(mediaPurposeValidator),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const page = args.purpose
      ? await ctx.db
          .query("media")
          .withIndex("by_purpose", (q) => q.eq("purpose", args.purpose!))
          .order("desc")
          .paginate(args.paginationOpts)
      : await ctx.db.query("media").order("desc").paginate(args.paginationOpts);
    const profile = await ctx.db.query("profile").unique();

    return {
      ...page,
      page: await Promise.all(
        page.page.map(async (media) => {
          const metadata = await ctx.db.system.get("_storage", media.storageId);
          const url =
            metadata && storageMatchesMedia(metadata, media)
              ? await ctx.storage.getUrl(media.storageId)
              : null;
          return {
            ...media,
            url,
            isInUse: profile?.avatarMediaId === media._id,
          };
        }),
      ),
    };
  },
});

export const updateAltText = mutation({
  args: { mediaId: v.id("media"), altText: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const media = await ctx.db.get("media", args.mediaId);
    if (!media) throw new ConvexError("Media not found.");

    const altText = args.altText.trim();
    if (altText.length > 300) {
      throw new ConvexError("Alt text must be 300 characters or fewer.");
    }
    await ctx.db.patch("media", media._id, {
      altText,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const remove = mutation({
  args: { mediaId: v.id("media") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const media = await ctx.db.get("media", args.mediaId);
    if (!media) throw new ConvexError("Media not found.");

    const profile = await ctx.db.query("profile").unique();
    if (profile?.avatarMediaId === media._id) {
      throw new ConvexError(
        "This media is currently used as the profile avatar. Detach it before deleting.",
      );
    }

    await ctx.storage.delete(media.storageId);
    await ctx.db.delete("media", media._id);
    return null;
  },
});
