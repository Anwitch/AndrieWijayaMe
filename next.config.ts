import type { NextConfig } from "next";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexStoragePattern = convexUrl
  ? (() => {
      const url = new URL(convexUrl);
      return {
        protocol: url.protocol.slice(0, -1) as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: "/api/storage/**",
      };
    })()
  : undefined;

// Lab (mini project, tools, game) di-host terpisah di repo anwitch-lab.
// Semua /lab/* diteruskan ke sana, jadi menambah project lab tidak perlu menyentuh repo ini.
const labOrigin = process.env.LAB_ORIGIN ?? "https://anwitch-lab.vercel.app";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: convexStoragePattern ? [convexStoragePattern] : [],
  },
  async rewrites() {
    return [
      { source: "/lab", destination: `${labOrigin}/lab` },
      { source: "/lab/:path*", destination: `${labOrigin}/lab/:path*` },
    ];
  },
};

export default nextConfig;
