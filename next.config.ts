import type { NextConfig } from "next";

// `npm run build` produces a static site in /out (works on Vercel, Netlify, GitHub Pages).
// PREVIEW_RELATIVE=1 makes asset URLs relative so the export can be opened from any folder.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  assetPrefix: process.env.PREVIEW_RELATIVE ? "./" : undefined,
};

export default nextConfig;
