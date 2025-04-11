/** @type {import('next').NextConfig} */
const nextConfig = {
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