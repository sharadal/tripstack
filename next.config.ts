import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Avatar uploads on /settings go through a Server Action. Files are
      // capped at 2 MB (app check + Storage bucket); the extra room covers
      // the other form fields and multipart overhead. Default is 1 MB.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
