import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminSignInForm from "@/components/mission-control/AdminSignInForm";

export const metadata: Metadata = {
  title: "Mission Control Login | Andrie Wijaya",
  robots: { index: false, follow: false },
};

export default function MissionControlLogin() {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-black"
        >
          <ArrowLeft size={14} /> Return to public site
        </Link>

        <section className="border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <span className="mb-3 inline-block bg-black px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
              Restricted
            </span>
            <h1 className="text-3xl font-bold tracking-tight">
              Mission Control
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
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
