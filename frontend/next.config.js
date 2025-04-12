/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        has: [
          {
            type: 'query',
            key: 'code',
            value: undefined
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig; 