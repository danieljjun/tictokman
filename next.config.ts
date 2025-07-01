import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'vercel.app'],
    unoptimized: true,
  },
};

export default nextConfig;
