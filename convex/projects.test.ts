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

describe("project slugs and case studies", () => {
  test("addProject stores canonical slug and caseStudy", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await admin.mutation(api.projects.addProject, {
      title: "PERMATA",
      description: "Platform magang multi-peran.",
      year: "2025",
      tags: "Laravel",
      slug: "permata-diskominfo",
      caseStudy: "## Masalah\nValidasi berkas manual.",
    });
    const project = await t.query(api.projects.getBySlug, {
      slug: "permata-diskominfo",
    });
    expect(project?.title).toBe("PERMATA");
    expect(project?.caseStudy).toContain("Masalah");
  });

  test("getBySlug hides unpublished projects", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await admin.mutation(api.projects.addProject, {
      title: "Draft",
      description: "Belum siap.",
      year: "2026",
      tags: "",
      slug: "draft-project",
      isPublished: false,
    });
    const project = await t.query(api.projects.getBySlug, {
      slug: "draft-project",
    });
    expect(project).toBeNull();
  });

  test("rejects duplicate slug on add", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    const base = {
      description: "Desc",
      year: "2026",
      tags: "",
      slug: "kedut",
    };
    await admin.mutation(api.projects.addProject, { ...base, title: "A" });
    await expect(
      admin.mutation(api.projects.addProject, { ...base, title: "B" }),
    ).rejects.toThrow(/slug/i);
  });

  test("updateProject can set slug, rejects duplicate from another project", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await admin.mutation(api.projects.addProject, {
      title: "A", description: "d", year: "2026", tags: "", slug: "slug-a",
    });
    await admin.mutation(api.projects.addProject, {
      title: "B", description: "d", year: "2026", tags: "",
    });
    const all = await admin.query(api.projects.listAll, {
      paginationOpts: { numItems: 10, cursor: null },
    });
    const b = all.page.find((p) => p.title === "B")!;
    await admin.mutation(api.projects.updateProject, {
      id: b._id,
      slug: "slug-b",
    });
    await expect(
      admin.mutation(api.projects.updateProject, { id: b._id, slug: "slug-a" }),
    ).rejects.toThrow(/slug/i);
  });

  test("moveProject reorders the public list and backfills legacy rows", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await t.run(async (ctx) => {
      const base = { description: "d", tags: "", year: "2026" };
      // Legacy rows without sortOrder, inserted oldest first.
      await ctx.db.insert("projects", {
        ...base,
        title: "Old",
        createdAt: 1,
      });
      await ctx.db.insert("projects", {
        ...base,
        title: "Middle",
        createdAt: 2,
      });
      await ctx.db.insert("projects", {
        ...base,
        title: "New",
        createdAt: 3,
      });
    });

    const titles = async () => {
      const result = await t.query(api.projects.listPublished, {
        paginationOpts: { numItems: 20, cursor: null },
      });
      return result.page
        .filter((project) => project !== null)
        .map((project) => project.title);
    };

    expect(await titles()).toEqual(["New", "Middle", "Old"]);

    const all = await admin.query(api.projects.listAll, {
      paginationOpts: { numItems: 20, cursor: null },
    });
    const old = all.page.find((project) => project.title === "Old")!;
    await admin.mutation(api.projects.moveProject, {
      id: old._id,
      direction: "up",
    });
    expect(await titles()).toEqual(["New", "Old", "Middle"]);

    await admin.mutation(api.projects.moveProject, {
      id: old._id,
      direction: "up",
    });
    expect(await titles()).toEqual(["Old", "New", "Middle"]);

    // Already at the top: no-op instead of an error.
    await admin.mutation(api.projects.moveProject, {
      id: old._id,
      direction: "up",
    });
    expect(await titles()).toEqual(["Old", "New", "Middle"]);
  });

  test("newly added projects land on top of reordered ones", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    const base = { description: "d", year: "2026", tags: "" };
    await admin.mutation(api.projects.addProject, { ...base, title: "First" });
    await admin.mutation(api.projects.addProject, { ...base, title: "Second" });
    await admin.mutation(api.projects.addProject, { ...base, title: "Third" });

    const all = await admin.query(api.projects.listAll, {
      paginationOpts: { numItems: 20, cursor: null },
    });
    expect(all.page.map((project) => project.title)).toEqual([
      "Third",
      "Second",
      "First",
    ]);

    const third = all.page.find((project) => project.title === "Third")!;
    await admin.mutation(api.projects.moveProject, {
      id: third._id,
      direction: "down",
    });
    await admin.mutation(api.projects.addProject, { ...base, title: "Fourth" });

    const reordered = await admin.query(api.projects.listAll, {
      paginationOpts: { numItems: 20, cursor: null },
    });
    expect(reordered.page.map((project) => project.title)).toEqual([
      "Fourth",
      "Second",
      "Third",
      "First",
    ]);
  });

  test("moveProject requires admin", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await admin.mutation(api.projects.addProject, {
      title: "A",
      description: "d",
      year: "2026",
      tags: "",
    });
    const all = await admin.query(api.projects.listAll, {
      paginationOpts: { numItems: 10, cursor: null },
    });
    await expect(
      t.mutation(api.projects.moveProject, {
        id: all.page[0]._id,
        direction: "up",
      }),
    ).rejects.toThrow();
  });

  test("getBySlug strips non-http links", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("projects", {
        title: "Legacy",
        description: "d",
        tags: "",
        year: "2026",
        slug: "legacy",
        link: "javascript:alert(1)",
        createdAt: Date.now(),
      });
    });
    const project = await t.query(api.projects.getBySlug, { slug: "legacy" });
    expect(project?.link).toBeUndefined();
  });
});
