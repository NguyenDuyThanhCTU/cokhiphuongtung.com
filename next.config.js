/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "pub-85e0caedbac24cc58c8c86d33edb0129.r2.dev",
      "pub-4f63e5d614b846c8a2980345d9033963.r2.dev",
      "upload.wikimedia.org",
    ],
  },
  experimental: {
    serverActions: true,
  },
  output: "standalone",
};

module.exports = nextConfig;
