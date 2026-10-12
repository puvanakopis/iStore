import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone only when explicitly requested (e.g. Docker builds)
  ...(process.env.BUILD_STANDALONE === "true" ? { output: "standalone" } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl && !backendUrl.startsWith("/")) {
      const cleanBackendUrl = backendUrl.replace(/\/$/, "");
      return [
        {
          source: "/api/:path*",
          destination: `${cleanBackendUrl}/api/:path*`,
        },
        {
          source: "/uploads/:path*",
          destination: `${cleanBackendUrl}/uploads/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
