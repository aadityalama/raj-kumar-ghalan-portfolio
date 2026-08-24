import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "placeholder.supabase.co";

const nextConfig: NextConfig = {
  // Hostinger Node.js Next apps run the standalone server. Setting this
  // explicitly keeps local production builds aligned with Hostinger.
  output: "standalone",
  experimental: {
    // CMS image uploads allow 5MB files; default Server Action limit is 1MB.
    // Keep Server Action IDs stable across Hostinger rebuilds by setting
    // NEXT_SERVER_ACTIONS_ENCRYPTION_KEY in Hostinger env (build + runtime).
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
