import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";
import { limitedText, requiredText } from "./lib/validation";

const defaults = {
  siteName: "Andrie Wijaya",
  seoTitle: "Andrie Wijaya — Merancang Solusi dari Masalah Nyata",
  seoDescription:
    "Aku mendokumentasikan proses memahami masalah dunia nyata, lalu merancang bagaimana teknologi bisa menyelesaikannya. Problem solving, bukan sekadar coding.",
  navAboutLabel: "About",
  navAboutVisible: true,
  navProjectsLabel: "Projects",
  navProjectsVisible: true,
  navWritingLabel: "Writing",
  navWritingVisible: true,
  footerText: "Mission Control: Restricted",
};

export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    if (!settings) return defaults;
    return {
      siteName: settings.siteName,
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      navAboutLabel: settings.navAboutLabel,
      navAboutVisible: settings.navAboutVisible,
      navProjectsLabel: settings.navProjectsLabel,
      navProjectsVisible: settings.navProjectsVisible,
      navWritingLabel: settings.navWritingLabel,
      navWritingVisible: settings.navWritingVisible,
      footerText: settings.footerText,
    };
  },
});

export const update = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const values = {
      siteName: requiredText(args.siteName, "Site name", 80),
      seoTitle: requiredText(args.seoTitle, "SEO title", 160),
      seoDescription: requiredText(
        args.seoDescription,
        "SEO description",
        320,
      ),
      navAboutLabel: requiredText(args.navAboutLabel, "About label", 32),
      navAboutVisible: args.navAboutVisible,
      navProjectsLabel: requiredText(
        args.navProjectsLabel,
        "Projects label",
        32,
      ),
      navProjectsVisible: args.navProjectsVisible,
      navWritingLabel: requiredText(
        args.navWritingLabel,
        "Writing label",
        32,
      ),
      navWritingVisible: args.navWritingVisible,
      footerText: limitedText(args.footerText, "Footer text", 240),
      updatedAt: Date.now(),
    };
    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    if (settings) {
      await ctx.db.patch(settings._id, values);
    } else {
      await ctx.db.insert("siteSettings", { key: "global", ...values });
    }
    return null;
  },
});
