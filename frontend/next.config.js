/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['lh3.googleusercontent.com', 'k.kakaocdn.net'],
  },
}

module.exports = nextConfig 