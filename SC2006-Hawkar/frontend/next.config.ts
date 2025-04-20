import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/stall/**',
      },
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
        pathname: '/profile-photo/**',
      },
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
        pathname: '/stall/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'play.min.io',
        port: '9000',
        pathname: '/stall/**',
      },
      {
        protocol: 'https',
        hostname: 'play.min.io',
        port: '9000',
        pathname: '/profile-photo/**',
      },
      {
        protocol: 'https',
        hostname: 'play.min.io',
        port: '9000',
        pathname: '/dish/**',
      }
    ]
  }
};

export default nextConfig;
