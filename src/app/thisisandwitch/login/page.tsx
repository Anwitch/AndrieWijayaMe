import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import AdminSignInForm from "@/components/mission-control/AdminSignInForm";
import { MonoLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mission Control Login",
  robots: { index: false, follow: false },
};

export default function MissionControlLogin() {
  return (
    <main className="min-h-screen bg-surface px-6 py-16 text-ink">
      <div className="mx-auto w-full max-w-md">
        <MonoLink href="/" className="mb-10">
          <ArrowLeft size={14} /> Return to public site
        </MonoLink>

        <section className="rounded-sm border border-line bg-paper p-8 shadow-sm">
          <div className="mb-8 border-b border-line pb-6">
            <span className="mb-3 inline-block bg-ink px-2 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-paper">
              Restricted
            </span>
            <h1 className="text-3xl font-semibold tracking-tight">
              Mission Control
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Authenticate with the administrator account to manage profile,
              projects, and mission logs.
            </p>
          </div>

          <AdminSignInForm />
        </section>
      </div>
    </main>
  );
}
