import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});

export const getFeaturedProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .order("desc")
      .collect();
  },
});

export const addProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    year: v.string(),
    tags: v.string(),
    link: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.insert("projects", {
      ...args,
      isFeatured: args.isFeatured ?? false,
      createdAt: Date.now(),
    });
  },
});

export const removeProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    year: v.optional(v.string()),
    tags: v.optional(v.string()),
    link: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});
