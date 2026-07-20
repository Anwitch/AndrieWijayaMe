import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";
import {
  limitedText,
  optionalHttpUrl,
  requiredText,
} from "./lib/validation";

function newestFirst<T extends { _creationTime: number }>(rows: T[]) {
  return rows.sort((a, b) => b._creationTime - a._creationTime);
}

function safePublicLink(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}

function sanitizePublicProjects<T extends { link?: string }>(projects: T[]) {
  return projects.map((project) => ({
    ...project,
    link: safePublicLink(project.link),
  }));
}

export const listPublished = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("projects")
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...result,
      page: result.page.map((project) =>
        project.isPublished === false
          ? null
          : sanitizePublicProjects([project])[0],
      ),
    };
  },
});

export const listAll = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("projects")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getFeaturedProjects = query({
  args: {},
  handler: async (ctx) => {
    const [published, legacy] = await Promise.all([
      ctx.db
        .query("projects")
        .withIndex("by_isPublished_and_isFeatured", (q) =>
          q.eq("isPublished", true).eq("isFeatured", true),
        )
        .order("desc")
        .take(6),
      ctx.db
        .query("projects")
        .withIndex("by_isPublished_and_isFeatured", (q) =>
          q.eq("isPublished", undefined).eq("isFeatured", true),
        )
        .order("desc")
        .take(6),
    ]);

    return sanitizePublicProjects(
      newestFirst([...published, ...legacy]).slice(0, 6),
    );
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
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    await ctx.db.insert("projects", {
      title: requiredText(args.title, "Project title", 160),
      description: requiredText(
        args.description,
        "Project description",
        5000,
      ),
      year: requiredText(args.year, "Project year", 32),
      tags: limitedText(args.tags, "Project tags", 500),
      link: optionalHttpUrl(args.link, "Project URL"),
      isFeatured: args.isFeatured ?? false,
      isPublished: args.isPublished ?? true,
      createdAt: now,
      updatedAt: now,
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
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    if (args.title !== undefined) {
      fields.title = requiredText(args.title, "Project title", 160);
    }
    if (args.description !== undefined) {
      fields.description = requiredText(
        args.description,
        "Project description",
        5000,
      );
    }
    if (args.year !== undefined) {
      fields.year = requiredText(args.year, "Project year", 32);
    }
    if (args.tags !== undefined) {
      fields.tags = limitedText(args.tags, "Project tags", 500);
    }
    if (args.link !== undefined) {
      fields.link = optionalHttpUrl(args.link, "Project URL");
    }
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});
