/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Directory-style output: every route becomes <route>/index.html, which every
  // static host (Amplify included) serves correctly with or without the slash.
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
