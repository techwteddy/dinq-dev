/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow the Anthropic API calls from API routes
  serverExternalPackages: [],
}

module.exports = nextConfig
