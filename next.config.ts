import type { NextConfig } from "next";

/*
 * GITHUB_PAGES=true builds a static export for GitHub Pages, served from
 * https://rajusomu.github.io/theorycloud-site/. Pages can't run server code, so the
 * deploy workflow removes the /api/leads route before building and the contact form
 * falls back to email (see demo-form.tsx). Normal dev/production builds are unchanged.
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/theorycloud-site" : "";

const nextConfig: NextConfig = {
  // Hide the Next.js dev tools badge during local development (it never ships to production)
  devIndicators: false,
  ...(pages && {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: pages ? "true" : "false",
  },
};

export default nextConfig;
