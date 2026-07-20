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

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: convexStoragePattern ? [convexStoragePattern] : [],
  },
};

export default nextConfig;
