"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { KeyRound, LogIn } from "lucide-react";

export default function AdminSignInForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [isSetup, setIsSetup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set("flow", isSetup ? "signUp" : "signIn");

    try {
      await signIn("password", formData);
      router.replace("/thisisandwitch");
      router.refresh();
    } catch {
      setError("Authentication failed. Check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      aria-busy={isSubmitting}
    >
      <div>
        <label
          htmlFor="admin-email"
          className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-gray-500"
        >
          Admin Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={isSubmitting}
          className="w-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black disabled:bg-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-gray-500"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete={isSetup ? "new-password" : "current-password"}
          minLength={14}
          required
          disabled={isSubmitting}
          className="w-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black disabled:bg-gray-100"
        />
        {isSetup && (
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            Use at least 14 characters with uppercase, lowercase, number, and
            symbol.
          </p>
        )}
      </div>

      {isSetup && (
        <div>
          <label
            htmlFor="admin-setup-secret"
            className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-gray-500"
          >
            Administrator Setup Code
          </label>
          <input
            id="admin-setup-secret"
            name="setupSecret"
            type="password"
            autoComplete="off"
            required
            disabled={isSubmitting}
            className="w-full border border-gray-300 bg-white px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-black disabled:bg-gray-100"
          />
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 bg-black px-4 py-3 font-mono text-xs uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isSetup ? <KeyRound size={15} /> : <LogIn size={15} />}
        {isSubmitting
          ? "Authenticating..."
          : isSetup
            ? "Initialize Admin"
            : "Enter Mission Control"}
      </button>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => {
          setError(null);
          setIsSetup((current) => !current);
        }}
        className="w-full font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-black disabled:text-gray-300"
      >
        {isSetup ? "Return to sign in" : "First-time administrator setup"}
      </button>
    </form>
  );
}
