import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type AdminContext = QueryCtx | MutationCtx;

export async function isAdmin(ctx: AdminContext) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return false;

  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const user = await ctx.db.get(userId);
  return Boolean(configuredEmail && user?.email?.trim().toLowerCase() === configuredEmail);
}

export async function requireAdmin(ctx: AdminContext) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError("Not authenticated.");
  }

  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const user = await ctx.db.get(userId);
  if (!configuredEmail || user?.email?.trim().toLowerCase() !== configuredEmail) {
    throw new ConvexError("Unauthorized.");
  }

  return user;
}
