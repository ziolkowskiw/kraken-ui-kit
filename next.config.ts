import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this repo (stray lockfiles exist in parent dirs).
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
