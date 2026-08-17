import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets phones on the LAN load dev assets when testing via the network URL
  // (e.g. `npm run dev` -> http://<lan-ip>:3000). Dev-only, no effect on prod.
  // Next.js only matches exact hosts or DNS-style wildcards here, not CIDR
  // ranges — update this if your machine's LAN IP changes.
  allowedDevOrigins: ["10.0.0.239"],
};

export default nextConfig;
