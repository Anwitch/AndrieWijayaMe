import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";
import { canonicalSlug, limitedText, requiredText } from "./lib/validation";
import type { MutationCtx } from "./_generated/server";

// The experience list is a short, hand-curated section, so every read is
// bounded by this instead of paginating.
const MAX_EXPERIENCES = 50;

const experienceFields = {
  title: v.string(),
  period: v.string(),
  description: v.string(),
  role: v.optional(v.string()),
  capabilities: v.optional(v.string()),
  base: v.optional(v.string()),
  organization: v.optional(v.string()),
  projectSlug: v.optional(v.string()),
  isPublished: v.optional(v.boolean()),
};

/** Trims an optional short field; blank input clears it. */
function optionalText(value: string | undefined, label: string) {
  if (value === undefined) return undefined;
  return limitedText(value, label, 160) || undefined;
}

function optionalProjectSlug(value: string | undefined) {
  if (value === undefined || value.trim() === "") return undefined;
  return canonicalSlug(value);
}

async function nextSortOrder(ctx: MutationCtx) {
  const [highest] = await ctx.db
    .query("experiences")
    .withIndex("by_sortOrder")
    .order("desc")
    .take(1);
  return (highest?.sortOrder ?? 0) + 1;
}

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_sortOrder")
      .order("desc")
      .take(MAX_EXPERIENCES);
    return experiences.filter((experience) => experience.isPublished);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("experiences")
      .withIndex("by_sortOrder")
      .order("desc")
      .take(MAX_EXPERIENCES);
  },
});

export const addExperience = mutation({
  args: experienceFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    await ctx.db.insert("experiences", {
      title: requiredText(args.title, "Experience title", 160),
      period: requiredText(args.period, "Experience period", 64),
      description: requiredText(
        args.description,
        "Experience description",
        2000,
      ),
      role: optionalText(args.role, "Role"),
      capabilities: optionalText(args.capabilities, "Capabilities"),
      base: optionalText(args.base, "Base"),
      organization: optionalText(args.organization, "Organization"),
      projectSlug: optionalProjectSlug(args.projectSlug),
      isPublished: args.isPublished ?? true,
      sortOrder: await nextSortOrder(ctx),
      createdAt: now,
      updatedAt: now,
    });
    return null;
  },
});

export const updateExperience = mutation({
  args: {
    id: v.id("experiences"),
    title: v.optional(v.string()),
    period: v.optional(v.string()),
    description: v.optional(v.string()),
    role: v.optional(v.string()),
    capabilities: v.optional(v.string()),
    base: v.optional(v.string()),
    organization: v.optional(v.string()),
    projectSlug: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    if (args.title !== undefined) {
      fields.title = requiredText(args.title, "Experience title", 160);
    }
    if (args.period !== undefined) {
      fields.period = requiredText(args.period, "Experience period", 64);
    }
    if (args.description !== undefined) {
      fields.description = requiredText(
        args.description,
        "Experience description",
        2000,
      );
    }
    // For optional fields an explicit empty string clears the stored value.
    if (args.role !== undefined) {
      fields.role = optionalText(args.role, "Role");
    }
    if (args.capabilities !== undefined) {
      fields.capabilities = optionalText(args.capabilities, "Capabilities");
    }
    if (args.base !== undefined) {
      fields.base = optionalText(args.base, "Base");
    }
    if (args.organization !== undefined) {
      fields.organization = optionalText(args.organization, "Organization");
    }
    if (args.projectSlug !== undefined) {
      fields.projectSlug = optionalProjectSlug(args.projectSlug);
    }
    await ctx.db.patch("experiences", id, { ...fields, updatedAt: Date.now() });
    return null;
  },
});

export const moveExperience = mutation({
  args: {
    id: v.id("experiences"),
    direction: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const experience = await ctx.db.get("experiences", args.id);
    if (!experience) {
      throw new ConvexError("Experience not found.");
    }
    const sortOrder = experience.sortOrder;

    // Higher sortOrder sits closer to the top, so "up" means the next larger value.
    const [neighbour] =
      args.direction === "up"
        ? await ctx.db
            .query("experiences")
            .withIndex("by_sortOrder", (q) => q.gt("sortOrder", sortOrder))
            .order("asc")
            .take(1)
        : await ctx.db
            .query("experiences")
            .withIndex("by_sortOrder", (q) => q.lt("sortOrder", sortOrder))
            .order("desc")
            .take(1);
    if (!neighbour) return null;

    await ctx.db.patch("experiences", experience._id, {
      sortOrder: neighbour.sortOrder,
    });
    await ctx.db.patch("experiences", neighbour._id, { sortOrder });
    return null;
  },
});

export const removeExperience = mutation({
  args: { id: v.id("experiences") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete("experiences", args.id);
    return null;
  },
});
