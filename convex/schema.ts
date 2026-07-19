import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    tags: v.string(), // We'll store as string and split later for simplicity, or use v.array(v.string())
    year: v.string(),
    link: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    createdAt: v.number(),
  }),
  profile: defineTable({
    bio: v.string(),
    tagline: v.string(),
    location: v.string(),
    status: v.string(),
  }),
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    publishedAt: v.number(),
    isPublished: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_isPublished_and_publishedAt", ["isPublished", "publishedAt"]),
});
