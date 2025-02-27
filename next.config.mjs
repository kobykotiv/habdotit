/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.carbonads.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PUSH_PUBLIC_KEY: process.env.NEXT_PUBLIC_PUSH_PUBLIC_KEY,
    NEXT_PUBLIC_PUSH_PRIVATE_KEY: process.env.NEXT_PUBLIC_PUSH_PRIVATE_KEY,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    NEXT_PUBLIC_VAPID_PRIVATE_KEY: process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY,
  },
}

export default nextConfig
