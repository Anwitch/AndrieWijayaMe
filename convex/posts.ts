import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireAdmin } from "./lib/admin";

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existingPost = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existingPost) {
      throw new ConvexError("A post with this URL slug already exists.");
    }

    const postId = await ctx.db.insert("posts", {
      ...args,
      publishedAt: Date.now(),
    });
    return postId;
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    category: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_isPublished_and_publishedAt", (q) => q.eq("isPublished", true))
      .order("desc")
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    return post?.isPublished ? post : null;
  },
});
