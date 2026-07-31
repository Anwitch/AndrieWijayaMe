import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { requireAdmin } from "./lib/admin";
import { canonicalSlug, limitedText, requiredText } from "./lib/validation";

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
    const slug = canonicalSlug(args.slug);
    const existingPost = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existingPost) {
      throw new ConvexError("A post with this URL slug already exists.");
    }

    const now = Date.now();
    const postId = await ctx.db.insert("posts", {
      title: requiredText(args.title, "Post title", 200),
      slug,
      content: requiredText(args.content, "Post content", 200000),
      excerpt: limitedText(args.excerpt, "Post excerpt", 500),
      category: requiredText(args.category, "Post category", 100),
      isPublished: args.isPublished,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
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
    if (args.title !== undefined) {
      updates.title = requiredText(args.title, "Post title", 200);
    }
    if (args.content !== undefined) {
      updates.content = requiredText(args.content, "Post content", 200000);
    }
    if (args.excerpt !== undefined) {
      updates.excerpt = limitedText(args.excerpt, "Post excerpt", 500);
    }
    if (args.category !== undefined) {
      updates.category = requiredText(args.category, "Post category", 100);
    }
    if (args.slug !== undefined) {
      const slug = canonicalSlug(args.slug);
      const existingPost = await ctx.db
        .query("posts")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existingPost && existingPost._id !== id) {
        throw new ConvexError("A post with this URL slug already exists.");
      }
      updates.slug = slug;
    }
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
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
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("posts")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const listPublished = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("posts")
      .withIndex("by_isPublished_and_publishedAt", (q) => q.eq("isPublished", true))
      .order("desc")
      .paginate(args.paginationOpts);
    return {
      ...result,
      page: result.page.map((post) => ({
        _id: post._id,
        _creationTime: post._creationTime,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.category,
        publishedAt: post.publishedAt,
        isPublished: post.isPublished,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        titleId: post.titleId,
        excerptId: post.excerptId,
        contentId: post.contentId,
      })),
    };
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
