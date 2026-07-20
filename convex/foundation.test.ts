/// <reference types="vite/client" />

import { beforeEach, describe, expect, test } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");
const ADMIN_EMAIL = "admin@example.com";

beforeEach(() => {
  process.env.ADMIN_EMAIL = ADMIN_EMAIL;
});

async function createAdmin(t: ReturnType<typeof convexTest>) {
  const userId = await t.run((ctx) =>
    ctx.db.insert("users", { email: ADMIN_EMAIL }),
  );
  return t.withIdentity({ subject: userId });
}

async function createAuthenticatedUser(
  t: ReturnType<typeof convexTest>,
  email: string,
) {
  const userId = await t.run((ctx) => ctx.db.insert("users", { email }));
  return t.withIdentity({ subject: userId });
}

describe("project visibility", () => {
  test("keeps legacy projects public and excludes drafts", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      const base = {
        description: "Description",
        tags: "Convex",
        year: "2026",
        createdAt: Date.now(),
      };
      await ctx.db.insert("projects", { ...base, title: "Legacy" });
      await ctx.db.insert("projects", {
        ...base,
        title: "Published",
        isPublished: true,
      });
      await ctx.db.insert("projects", {
        ...base,
        title: "Draft",
        isPublished: false,
      });
    });

    const projects = await t.query(api.projects.listPublished, {
      paginationOpts: { numItems: 20, cursor: null },
    });
    expect(
      projects.page
        .filter((project) => project !== null)
        .map((project) => project.title)
        .sort(),
    ).toEqual(["Legacy", "Published"]);

    const firstPage = await t.query(api.projects.listPublished, {
      paginationOpts: { numItems: 1, cursor: null },
    });
    const secondPage = await t.query(api.projects.listPublished, {
      paginationOpts: {
        numItems: 1,
        cursor: firstPage.continueCursor,
      },
    });
    const thirdPage = await t.query(api.projects.listPublished, {
      paginationOpts: {
        numItems: 1,
        cursor: secondPage.continueCursor,
      },
    });
    expect(
      [...firstPage.page, ...secondPage.page, ...thirdPage.page]
        .filter((project) => project !== null)
        .map((project) => project.title),
    ).toEqual(["Published", "Legacy"]);
  });

  test("rejects unsafe project URLs at the backend boundary", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);

    await expect(
      admin.mutation(api.projects.addProject, {
        title: "Unsafe",
        description: "Description",
        tags: "",
        year: "2026",
        link: "javascript:alert(1)",
      }),
    ).rejects.toThrow("Project URL must be a valid HTTP or HTTPS URL.");
  });

  test("does not expose unsafe links from legacy records", async () => {
    const t = convexTest(schema, modules);
    await t.run((ctx) =>
      ctx.db.insert("projects", {
        title: "Legacy unsafe link",
        description: "Description",
        tags: "",
        year: "2026",
        link: "javascript:alert(1)",
        createdAt: Date.now(),
      }),
    );

    const projects = await t.query(api.projects.listPublished, {
      paginationOpts: { numItems: 20, cursor: null },
    });
    expect(projects.page[0]?.link).toBeUndefined();
  });
});

describe("post slugs", () => {
  test("prevents duplicate slugs during updates", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    const firstId = await admin.mutation(api.posts.create, {
      title: "First",
      slug: "first",
      content: "First post content",
      excerpt: "First excerpt",
      category: "Test",
      isPublished: true,
    });
    const secondId = await admin.mutation(api.posts.create, {
      title: "Second",
      slug: "second",
      content: "Second post content",
      excerpt: "Second excerpt",
      category: "Test",
      isPublished: true,
    });

    await expect(
      admin.mutation(api.posts.update, { id: secondId, slug: "first" }),
    ).rejects.toThrow("A post with this URL slug already exists.");

    const first = await t.run((ctx) => ctx.db.get(firstId));
    const second = await t.run((ctx) => ctx.db.get(secondId));
    expect(first?.slug).toBe("first");
    expect(second?.slug).toBe("second");
  });
});

describe("site settings", () => {
  test("uses defaults and only allows an admin to update them", async () => {
    const t = convexTest(schema, modules);
    const defaults = await t.query(api.siteSettings.get, {});
    expect(defaults.siteName).toBe("Andrie Wijaya");

    await expect(
      t.mutation(api.siteSettings.update, {
        ...defaults,
        siteName: "Unauthorized",
      }),
    ).rejects.toThrow("Not authenticated.");

    const nonAdmin = await createAuthenticatedUser(t, "editor@example.com");
    await expect(
      nonAdmin.mutation(api.siteSettings.update, {
        ...defaults,
        siteName: "Unauthorized",
      }),
    ).rejects.toThrow("Unauthorized.");

    const admin = await createAdmin(t);
    await admin.mutation(api.siteSettings.update, {
      ...defaults,
      siteName: "Field Notes",
    });

    const settings = await t.query(api.siteSettings.get, {});
    expect(settings.siteName).toBe("Field Notes");
  });
});

describe("admin authorization", () => {
  test("rejects protected content operations from a non-admin account", async () => {
    const t = convexTest(schema, modules);
    const nonAdmin = await createAuthenticatedUser(t, "editor@example.com");
    const paginationOpts = { numItems: 20, cursor: null };

    await expect(
      nonAdmin.query(api.projects.listAll, { paginationOpts }),
    ).rejects.toThrow("Unauthorized.");
    await expect(
      nonAdmin.query(api.posts.listAll, { paginationOpts }),
    ).rejects.toThrow("Unauthorized.");
    await expect(
      nonAdmin.mutation(api.profile.update, { bio: "Unauthorized" }),
    ).rejects.toThrow("Unauthorized.");
  });
});
