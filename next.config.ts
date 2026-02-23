import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['bcryptjs'],
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
