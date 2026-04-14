import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: [],
    unoptimized: true,
  },
};

export default nextConfig;
