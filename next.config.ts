import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev tools badge during local development (it never ships to production)
  devIndicators: false,
};

export default nextConfig;
