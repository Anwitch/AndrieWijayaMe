import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("profile").unique();
  },
});

export const update = mutation({
  args: {
    bio: v.optional(v.string()),
    tagline: v.optional(v.string()),
    location: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const profile = await ctx.db.query("profile").unique();
    if (profile) {
      await ctx.db.patch(profile._id, args);
    } else {
      await ctx.db.insert("profile", {
        bio: args.bio ?? "",
        tagline: args.tagline ?? "",
        location: args.location ?? "",
        status: args.status ?? "",
      });
    }
  },
});
