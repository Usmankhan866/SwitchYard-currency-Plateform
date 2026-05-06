import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@dashboardpack/core"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
