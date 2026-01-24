/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.0.3',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
