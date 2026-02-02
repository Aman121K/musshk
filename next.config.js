/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.musshk.com/api',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'musshk-images.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.musshk.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig

