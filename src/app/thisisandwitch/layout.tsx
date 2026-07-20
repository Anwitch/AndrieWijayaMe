import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission Control",
  robots: { index: false, follow: false },
};

export default function MissionControlLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
