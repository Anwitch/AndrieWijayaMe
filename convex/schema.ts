import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export const pressItemValidator = v.object({
  publisher: v.string(),
  title: v.string(),
  url: v.string(),
  // ISO date (YYYY-MM-DD) the piece was published.
  date: v.optional(v.string()),
});

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
    // Third-party coverage of the project. Capped at MAX_PRESS_ITEMS on write.
    press: v.optional(v.array(pressItemValidator)),
    coverMediaId: v.optional(v.id("media")),
    isFeatured: v.optional(v.boolean()),
    // Optional during the migration window. Missing means published.
    isPublished: v.optional(v.boolean()),
    // Manual display order. Higher sorts first. Missing on legacy rows, which
    // fall back to newest-first because undefined sorts last in descending order.
    sortOrder: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_isPublished_and_isFeatured_and_sortOrder", [
      "isPublished",
      "isFeatured",
      "sortOrder",
    ])
    .index("by_sortOrder", ["sortOrder"])
    .index("by_slug", ["slug"]),
  experiences: defineTable({
    title: v.string(),
    period: v.string(),
    description: v.string(),
    role: v.optional(v.string()),
    capabilities: v.optional(v.string()),
    base: v.optional(v.string()),
    // Organisation the experience belongs to; feeds the Person JSON-LD.
    organization: v.optional(v.string()),
    // Slug of a related project; links the entry to its case study page.
    projectSlug: v.optional(v.string()),
    isPublished: v.boolean(),
    // Manual display order. Higher sorts first.
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_sortOrder", ["sortOrder"]),
  profile: defineTable({
    bio: v.string(),
    tagline: v.string(),
    location: v.string(),
    status: v.string(),
    avatarMediaId: v.optional(v.id("media")),
    specialization: v.optional(v.string()),
    currentFocus: v.optional(v.string()),
    educationTitle: v.optional(v.string()),
    educationPeriod: v.optional(v.string()),
    educationDescription: v.optional(v.string()),
    educationFocus: v.optional(v.string()),
    educationMethod: v.optional(v.string()),
    educationLocation: v.optional(v.string()),
    experienceTitle: v.optional(v.string()),
    experiencePeriod: v.optional(v.string()),
    experienceDescription: v.optional(v.string()),
    experienceRole: v.optional(v.string()),
    experienceCapabilities: v.optional(v.string()),
    experienceBase: v.optional(v.string()),
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
    coverMediaId: v.optional(v.id("media")),
    publishedAt: v.number(),
    isPublished: v.boolean(),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    titleId: v.optional(v.string()),
    excerptId: v.optional(v.string()),
    contentId: v.optional(v.string()),
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
