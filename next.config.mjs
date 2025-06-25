/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@neondatabase/serverless'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*'
      }
    ];
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons']
  },
  async redirects() {
    return [];
  },
  // Configure for Replit hosting
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;