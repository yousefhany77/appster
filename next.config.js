/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: false,
  modularizeImports: {
    "@acme/ui": {
      transform: "@acme/ui/dist/{{member}}",
    },
  },
};

module.exports = nextConfig;
