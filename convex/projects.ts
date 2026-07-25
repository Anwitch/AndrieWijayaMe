import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";
import {
  canonicalSlug,
  limitedText,
  optionalHttpUrl,
  requiredText,
} from "./lib/validation";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// Upper bound for the one-time backfill pass that gives every project an
// explicit sortOrder. Steady-state reordering only touches two documents.
const MAX_ORDERABLE_PROJECTS = 200;

// Mirrors how the `by_sortOrder` index reads in descending order: rows with an
// explicit sortOrder come first (highest wins), legacy rows follow newest-first.
function manualOrderFirst<
  T extends { sortOrder?: number; _creationTime: number },
>(rows: T[]) {
  return rows.sort((a, b) => {
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return b.sortOrder - a.sortOrder || b._creationTime - a._creationTime;
    }
    if (a.sortOrder !== undefined) return -1;
    if (b.sortOrder !== undefined) return 1;
    return b._creationTime - a._creationTime;
  });
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

async function assertSlugAvailable(
  ctx: MutationCtx,
  slug: string,
  selfId?: Id<"projects">,
) {
  const existing = await ctx.db
    .query("projects")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
  if (existing && existing._id !== selfId) {
    throw new ConvexError("A project with this slug already exists.");
  }
}

// Assigns every project an explicit sortOrder, preserving the order they are
// already displayed in. Runs once, the first time an admin reorders anything.
async function backfillSortOrder(ctx: MutationCtx) {
  const ordered = await ctx.db
    .query("projects")
    .withIndex("by_sortOrder")
    .order("desc")
    .take(MAX_ORDERABLE_PROJECTS);

  for (const [index, project] of ordered.entries()) {
    const sortOrder = ordered.length - index;
    if (project.sortOrder !== sortOrder) {
      await ctx.db.patch(project._id, { sortOrder });
    }
  }
}

async function nextSortOrder(ctx: MutationCtx) {
  const [highest] = await ctx.db
    .query("projects")
    .withIndex("by_sortOrder")
    .order("desc")
    .take(1);
  return (highest?.sortOrder ?? 0) + 1;
}

export const listPublished = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("projects")
      .withIndex("by_sortOrder")
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
      .withIndex("by_sortOrder")
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
        .withIndex("by_isPublished_and_isFeatured_and_sortOrder", (q) =>
          q.eq("isPublished", true).eq("isFeatured", true),
        )
        .order("desc")
        .take(6),
      ctx.db
        .query("projects")
        .withIndex("by_isPublished_and_isFeatured_and_sortOrder", (q) =>
          q.eq("isPublished", undefined).eq("isFeatured", true),
        )
        .order("desc")
        .take(6),
    ]);

    return sanitizePublicProjects(
      manualOrderFirst([...published, ...legacy]).slice(0, 6),
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
    slug: v.optional(v.string()),
    caseStudy: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    let slug: string | undefined;
    if (args.slug !== undefined && args.slug.trim() !== "") {
      slug = canonicalSlug(args.slug);
      await assertSlugAvailable(ctx, slug);
    }
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
      slug,
      caseStudy:
        args.caseStudy !== undefined
          ? limitedText(args.caseStudy, "Case study", 200000)
          : undefined,
      isFeatured: args.isFeatured ?? false,
      isPublished: args.isPublished ?? true,
      sortOrder: await nextSortOrder(ctx),
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const moveProject = mutation({
  args: {
    id: v.id("projects"),
    direction: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const [unordered] = await ctx.db
      .query("projects")
      .withIndex("by_sortOrder", (q) => q.eq("sortOrder", undefined))
      .take(1);
    if (unordered) {
      await backfillSortOrder(ctx);
    }

    const project = await ctx.db.get(args.id);
    if (!project || project.sortOrder === undefined) {
      throw new ConvexError("Project not found.");
    }
    const sortOrder = project.sortOrder;

    // Higher sortOrder sits closer to the top, so "up" means the next larger value.
    const [neighbour] =
      args.direction === "up"
        ? await ctx.db
            .query("projects")
            .withIndex("by_sortOrder", (q) => q.gt("sortOrder", sortOrder))
            .order("asc")
            .take(1)
        : await ctx.db
            .query("projects")
            .withIndex("by_sortOrder", (q) => q.lt("sortOrder", sortOrder))
            .order("desc")
            .take(1);
    if (!neighbour) return null;

    await ctx.db.patch(project._id, { sortOrder: neighbour.sortOrder });
    await ctx.db.patch(neighbour._id, { sortOrder });
    return null;
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
    slug: v.optional(v.string()),
    caseStudy: v.optional(v.string()),
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
    if (args.slug !== undefined) {
      if (args.slug.trim() === "") {
        fields.slug = undefined;
      } else {
        const slug = canonicalSlug(args.slug);
        await assertSlugAvailable(ctx, slug, id);
        fields.slug = slug;
      }
    }
    if (args.caseStudy !== undefined) {
      fields.caseStudy = limitedText(args.caseStudy, "Case study", 200000);
    }
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!project || project.isPublished === false) return null;
    return sanitizePublicProjects([project])[0];
  },
});
