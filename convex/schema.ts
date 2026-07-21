import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    tags: v.string(),
    year: v.string(),
    link: v.optional(v.string()),
    slug: v.optional(v.string()),
    caseStudy: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    // Optional during the migration window. Missing means published.
    isPublished: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_isPublished_and_isFeatured", [
      "isPublished",
      "isFeatured",
    ])
    .index("by_slug", ["slug"]),
  profile: defineTable({
    bio: v.string(),
    tagline: v.string(),
    location: v.string(),
    status: v.string(),
    avatarMediaId: v.optional(v.id("media")),
    specialization: v.optional(v.string()),
    currentFocus: v.optional(v.string()),
    xUrl: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  }),
  media: defineTable({
    storageId: v.id("_storage"),
    originalName: v.string(),
    contentType: v.string(),
    size: v.number(),
    purpose: v.union(
      v.literal("profile-avatar"),
      v.literal("project-cover"),
      v.literal("post-cover"),
    ),
    altText: v.string(),
    uploadedBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_storageId", ["storageId"])
    .index("by_purpose", ["purpose"]),
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    publishedAt: v.number(),
    isPublished: v.boolean(),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_isPublished_and_publishedAt", ["isPublished", "publishedAt"]),
  siteSettings: defineTable({
    key: v.literal("global"),
    siteName: v.string(),
    seoTitle: v.string(),
    seoDescription: v.string(),
    navAboutLabel: v.string(),
    navAboutVisible: v.boolean(),
    navProjectsLabel: v.string(),
    navProjectsVisible: v.boolean(),
    navWritingLabel: v.string(),
    navWritingVisible: v.boolean(),
    footerText: v.string(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});
