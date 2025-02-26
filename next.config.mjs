/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.carbonads.com', 'example.com', 'anotherdomain.com'],
  },
}

export default nextConfig
