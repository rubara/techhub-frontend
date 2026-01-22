/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,

  // Image configuration for Strapi
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.0.3',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
    // Domains fallback for older Next.js versions
    domains: ['192.168.0.3', 'localhost', 'picsum.photos'],
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://192.168.0.3:1337',
  },
};

export default nextConfig;

