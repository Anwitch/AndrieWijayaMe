/// <reference types="vite/client" />

import { beforeEach, describe, expect, test } from "vitest";
import { convexTest } from "convex-test";
import type { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";
import schema from "./schema";
import { MAX_MEDIA_SIZE } from "./lib/media";

const modules = import.meta.glob("./**/*.ts");
const ADMIN_EMAIL = "admin@example.com";

beforeEach(() => {
  process.env.ADMIN_EMAIL = ADMIN_EMAIL;
});

async function createUser(t: ReturnType<typeof convexTest>, email: string) {
  const userId = await t.run((ctx) => ctx.db.insert("users", { email }));
  return { client: t.withIdentity({ subject: userId }), userId };
}

async function storeFile(
  t: ReturnType<typeof convexTest>,
  contentType: string,
  size = 128,
) {
  return await t.run(async (ctx) => {
    const storageId = await ctx.storage.store(
      new Blob([new Uint8Array(size)], { type: contentType }),
    );
    // convex-test does not currently persist Blob.type in _storage metadata.
    await (
      ctx.db as unknown as {
        patch: (
          id: Id<"_storage">,
          value: { contentType: string },
        ) => Promise<void>;
      }
    ).patch(storageId, { contentType });
    return storageId;
  });
}

async function finalizeProfileImage(
  t: ReturnType<typeof convexTest>,
  storageId: Id<"_storage">,
) {
  const { client: admin } = await createUser(t, ADMIN_EMAIL);
  const result = await admin.mutation(api.media.finalize, {
    storageId,
    originalName: "avatar.webp",
    purpose: "profile-avatar",
    altText: "Portrait of Andrie",
  });
  if (result.status !== "created") throw new Error(result.reason);
  return { admin, mediaId: result.mediaId };
}

describe("media authorization and validation", () => {
  test("only allows the configured admin to request upload URLs", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.media.generateUploadUrl, {}),
    ).rejects.toThrow("Not authenticated.");

    const { client: nonAdmin } = await createUser(t, "editor@example.com");
    await expect(
      nonAdmin.mutation(api.media.generateUploadUrl, {}),
    ).rejects.toThrow("Unauthorized.");

    const { client: admin } = await createUser(t, ADMIN_EMAIL);
    await expect(admin.mutation(api.media.generateUploadUrl, {})).resolves.toMatch(
      /^https:\/\//,
    );
  });

  test("rejects and cleans up an oversized upload", async () => {
    const t = convexTest(schema, modules);
    const storageId = await storeFile(t, "image/png", MAX_MEDIA_SIZE + 1);
    const { client: admin } = await createUser(t, ADMIN_EMAIL);

    const result = await admin.mutation(api.media.finalize, {
      storageId,
      originalName: "large.png",
      purpose: "profile-avatar",
      altText: "Large image",
    });
    expect(result).toEqual({
      status: "rejected",
      reason: "Images must be 5 MB or smaller.",
    });
    await expect(
      t.run((ctx) => ctx.db.system.get("_storage", storageId)),
    ).resolves.toBeNull();
  });

  test("rejects and cleans up an invalid MIME type", async () => {
    const t = convexTest(schema, modules);
    const storageId = await storeFile(t, "image/gif");
    const { client: admin } = await createUser(t, ADMIN_EMAIL);

    const result = await admin.mutation(api.media.finalize, {
      storageId,
      originalName: "animated.gif",
      purpose: "profile-avatar",
      altText: "Animation",
    });
    expect(result.status).toBe("rejected");
    await expect(
      t.run((ctx) => ctx.db.system.get("_storage", storageId)),
    ).resolves.toBeNull();
  });

  test("finalizes valid media from authoritative storage metadata", async () => {
    const t = convexTest(schema, modules);
    const storageId = await storeFile(t, "image/webp", 512);
    const { admin, mediaId } = await finalizeProfileImage(t, storageId);

    const media = await t.run((ctx) => ctx.db.get("media", mediaId));
    expect(media).toMatchObject({
      storageId,
      originalName: "avatar.webp",
      contentType: "image/webp",
      size: 512,
      purpose: "profile-avatar",
      altText: "Portrait of Andrie",
    });

    const library = await admin.query(api.media.list, {
      paginationOpts: { numItems: 10, cursor: null },
    });
    expect(library.page[0]).toMatchObject({ url: expect.any(String) });
    expect(library.page[0]?._id).toBe(mediaId);
  });
});

describe("profile avatar media", () => {
  test("attaches and detaches a validated avatar", async () => {
    const t = convexTest(schema, modules);
    const storageId = await storeFile(t, "image/jpeg");
    const { admin, mediaId } = await finalizeProfileImage(t, storageId);

    await admin.mutation(api.profile.setAvatar, { mediaId });
    const attached = await t.query(api.profile.get, {});
    expect(attached).toMatchObject({
      avatarMediaId: mediaId,
      avatarAltText: "Portrait of Andrie",
      avatarUrl: expect.stringContaining("/api/storage/"),
    });

    await admin.mutation(api.profile.setAvatar, { mediaId: null });
    const detached = await t.query(api.profile.get, {});
    expect(detached?.avatarMediaId).toBeUndefined();
    expect(detached?.avatarUrl).toBeNull();
  });

  test("does not delete media while it is used by the profile", async () => {
    const t = convexTest(schema, modules);
    const storageId = await storeFile(t, "image/png");
    const { admin, mediaId } = await finalizeProfileImage(t, storageId);
    await admin.mutation(api.profile.setAvatar, { mediaId });

    await expect(
      admin.mutation(api.media.remove, { mediaId }),
    ).rejects.toThrow("currently used as the profile avatar");
    await expect(t.run((ctx) => ctx.db.get("media", mediaId))).resolves.not.toBeNull();
  });

  test("keeps a legacy profile without avatar media working", async () => {
    const t = convexTest(schema, modules);
    await t.run((ctx) =>
      ctx.db.insert("profile", {
        bio: "Legacy profile",
        tagline: "Builder",
        location: "Pontianak",
        status: "Available",
      }),
    );

    const profile = await t.query(api.profile.get, {});
    expect(profile).toMatchObject({ bio: "Legacy profile", avatarUrl: null });
    expect(profile?.avatarMediaId).toBeUndefined();
  });

  test("does not expose a URL after storage metadata becomes invalid", async () => {
    const t = convexTest(schema, modules);
    const storageId = await storeFile(t, "image/webp");
    const { admin, mediaId } = await finalizeProfileImage(t, storageId);
    await admin.mutation(api.profile.setAvatar, { mediaId });

    await t.run(async (ctx) => {
      await (
        ctx.db as unknown as {
          patch: (
            id: Id<"_storage">,
            value: { contentType: string },
          ) => Promise<void>;
        }
      ).patch(storageId, { contentType: "text/plain" });
    });

    const profile = await t.query(api.profile.get, {});
    expect(profile?.avatarUrl).toBeNull();
  });
});
