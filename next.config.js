/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["tailwindui.com", "tailwindui.com", "cdn.shopify.com"],
  },
}

module.exports = nextConfig
