import { query } from "./_generated/server";
import { isAdmin } from "./lib/admin";

export const isCurrentUserAdmin = query({
  args: {},
  handler: async (ctx) => await isAdmin(ctx),
});
