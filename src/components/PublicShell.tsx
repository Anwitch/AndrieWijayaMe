"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import PublicFooter from "@/components/PublicFooter";

export default function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-[var(--text-primary)]">
      <Navbar />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </div>
  );
}
