/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/tin-tuc", destination: "/chuyen-muc", permanent: true },
      { source: "/dich-vu/:slug", destination: "/san-pham/:slug", permanent: true },
      { source: "/chi-tiet-san-pham/:slug", destination: "/san-pham/:slug", permanent: true },
      { source: "/chinh-sach-bao-mat", destination: "/chinh-sach/chinh-sach-bao-mat", permanent: true },
      { source: "/dieu-khoan-su-dung", destination: "/chinh-sach/dieu-khoan-su-dung", permanent: true },
    ];
  },
  images: {
    domains: [
      "pub-85e0caedbac24cc58c8c86d33edb0129.r2.dev",
      "pub-84f5bb6490a34f289a7c796e2210e0fc.r2.dev",
      "upload.wikimedia.org",
      "firebasestorage.googleapis.com",
    ],
  },
  experimental: {
    serverActions: true,
  },
  output: "standalone",
};

module.exports = nextConfig;
