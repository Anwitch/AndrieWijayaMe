import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

const invalidCredentials = () => new ConvexError("Invalid administrator credentials.");

const passwordProvider = Password({
  profile(params) {
    const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const email = typeof params.email === "string" ? params.email.trim().toLowerCase() : "";

    if (!configuredEmail || !email || email !== configuredEmail) {
      throw invalidCredentials();
    }

    if (params.flow === "signUp") {
      const configuredSecret = process.env.ADMIN_SETUP_SECRET;
      const suppliedSecret = typeof params.setupSecret === "string" ? params.setupSecret : "";
      if (!configuredSecret || configuredSecret.length < 64 || suppliedSecret !== configuredSecret) {
        throw invalidCredentials();
      }
    }

    return { email };
  },
  validatePasswordRequirements(password) {
    if (
      password.length < 14 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      throw new ConvexError(
        "Password must be at least 14 characters and include uppercase, lowercase, number, and symbol.",
      );
    }
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [passwordProvider],
});
