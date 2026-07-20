"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { KeyRound, LogIn } from "lucide-react";
import { Button, FeedbackNote, inputClass, labelClass } from "@/components/ui";

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
          className={`mb-2 block ${labelClass}`}
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
          className={`${inputClass} px-4 py-3`}
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className={`mb-2 block ${labelClass}`}
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
          className={`${inputClass} px-4 py-3`}
        />
        {isSetup && (
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Use at least 14 characters with uppercase, lowercase, number, and
            symbol.
          </p>
        )}
      </div>

      {isSetup && (
        <div>
          <label
            htmlFor="admin-setup-secret"
            className={`mb-2 block ${labelClass}`}
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
            className={`${inputClass} px-4 py-3 font-mono`}
          />
        </div>
      )}

      {error && <FeedbackNote tone="error">{error}</FeedbackNote>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSetup ? <KeyRound size={15} /> : <LogIn size={15} />}
        {isSubmitting
          ? "Authenticating..."
          : isSetup
            ? "Initialize Admin"
            : "Enter Mission Control"}
      </Button>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => {
          setError(null);
          setIsSetup((current) => !current);
        }}
        className="w-full font-mono text-xs uppercase tracking-widest text-ink-muted hover:text-ink disabled:text-ink-faint"
      >
        {isSetup ? "Return to sign in" : "First-time administrator setup"}
      </button>
    </form>
  );
}
