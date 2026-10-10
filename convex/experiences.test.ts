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

const base = { period: "2026", description: "Deskripsi." };

describe("experiences", () => {
  test("listPublished returns newest first and hides drafts", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await admin.mutation(api.experiences.addExperience, {
      ...base,
      title: "First",
    });
    await admin.mutation(api.experiences.addExperience, {
      ...base,
      title: "Draft",
      isPublished: false,
    });
    await admin.mutation(api.experiences.addExperience, {
      ...base,
      title: "Third",
      projectSlug: "Aterostop",
    });

    const published = await t.query(api.experiences.listPublished, {});
    expect(published.map((experience) => experience.title)).toEqual([
      "Third",
      "First",
    ]);
    expect(published[0].projectSlug).toBe("aterostop");
  });

  test("moveExperience swaps neighbours and is a no-op at the edge", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await admin.mutation(api.experiences.addExperience, { ...base, title: "A" });
    await admin.mutation(api.experiences.addExperience, { ...base, title: "B" });

    const titles = async () =>
      (await t.query(api.experiences.listPublished, {})).map(
        (experience) => experience.title,
      );
    expect(await titles()).toEqual(["B", "A"]);

    const all = await admin.query(api.experiences.listAll, {});
    const a = all.find((experience) => experience.title === "A")!;
    await admin.mutation(api.experiences.moveExperience, {
      id: a._id,
      direction: "up",
    });
    expect(await titles()).toEqual(["A", "B"]);

    await admin.mutation(api.experiences.moveExperience, {
      id: a._id,
      direction: "up",
    });
    expect(await titles()).toEqual(["A", "B"]);
  });

  test("updateExperience clears optional fields with an empty string", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await admin.mutation(api.experiences.addExperience, {
      ...base,
      title: "A",
      role: "Peran",
      projectSlug: "kedut",
    });
    const [experience] = await admin.query(api.experiences.listAll, {});
    await admin.mutation(api.experiences.updateExperience, {
      id: experience._id,
      role: "",
      projectSlug: "",
    });
    const [updated] = await admin.query(api.experiences.listAll, {});
    expect(updated.role).toBeUndefined();
    expect(updated.projectSlug).toBeUndefined();
  });

  test("mutations require admin", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.experiences.addExperience, { ...base, title: "A" }),
    ).rejects.toThrow();
    await expect(t.query(api.experiences.listAll, {})).rejects.toThrow();
  });
});

describe("project press", () => {
  test("stores normalized press and clears it with an empty list", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await admin.mutation(api.projects.addProject, {
      title: "ATEROSTOP",
      description: "d",
      year: "2026",
      tags: "",
      slug: "aterostop",
      press: [
        {
          publisher: " UNTAN ",
          title: "Judul",
          url: "https://untan.ac.id/a",
          date: "2026-09-09",
        },
      ],
    });
    const project = await t.query(api.projects.getBySlug, {
      slug: "aterostop",
    });
    expect(project?.press).toEqual([
      {
        publisher: "UNTAN",
        title: "Judul",
        url: "https://untan.ac.id/a",
        date: "2026-09-09",
      },
    ]);

    const all = await admin.query(api.projects.listAll, {
      paginationOpts: { numItems: 10, cursor: null },
    });
    await admin.mutation(api.projects.updateProject, {
      id: all.page[0]._id,
      press: [],
    });
    const cleared = await t.query(api.projects.getBySlug, {
      slug: "aterostop",
    });
    expect(cleared?.press).toBeUndefined();
  });

  test("rejects non-http press URLs and malformed dates", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    const project = { title: "A", description: "d", year: "2026", tags: "" };
    await expect(
      admin.mutation(api.projects.addProject, {
        ...project,
        press: [{ publisher: "X", title: "T", url: "javascript:alert(1)" }],
      }),
    ).rejects.toThrow(/URL/);
    await expect(
      admin.mutation(api.projects.addProject, {
        ...project,
        press: [
          { publisher: "X", title: "T", url: "https://x.id", date: "9 Sep" },
        ],
      }),
    ).rejects.toThrow(/YYYY-MM-DD/);
  });
});
