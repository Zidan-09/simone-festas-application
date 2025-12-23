import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "guftndtc0tst42su.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
