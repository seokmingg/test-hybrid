/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  compiler: {
    // ✅ 프로덕션 빌드 시 console.log 제거
    removeConsole: {
      exclude: ['error'], // error만 남기고 나머지 제거 (info, debug, log 등 다 사라짐)
    },
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