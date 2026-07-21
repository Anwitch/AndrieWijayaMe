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

describe("profile social urls", () => {
  test("admin can set linkedinUrl and githubUrl", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await admin.mutation(api.profile.update, {
      linkedinUrl: "https://www.linkedin.com/in/andrie-wijaya",
      githubUrl: "https://github.com/Anwitch",
    });
    const profile = await t.query(api.profile.get, {});
    expect(profile?.linkedinUrl).toBe(
      "https://www.linkedin.com/in/andrie-wijaya",
    );
    expect(profile?.githubUrl).toBe("https://github.com/Anwitch");
  });

  test("rejects non-linkedin host for linkedinUrl", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await expect(
      admin.mutation(api.profile.update, {
        linkedinUrl: "https://evil.com/in/andrie",
      }),
    ).rejects.toThrow(/LinkedIn URL/);
  });

  test("rejects non-github host for githubUrl", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await expect(
      admin.mutation(api.profile.update, {
        githubUrl: "http://github.com/Anwitch",
      }),
    ).rejects.toThrow(/GitHub URL/);
  });

  test("empty string clears the field", async () => {
    const t = convexTest(schema, modules);
    const admin = await createAdmin(t);
    await admin.mutation(api.profile.update, {
      githubUrl: "https://github.com/Anwitch",
    });
    await admin.mutation(api.profile.update, { githubUrl: "" });
    const profile = await t.query(api.profile.get, {});
    expect(profile?.githubUrl).toBeFalsy();
  });
});
