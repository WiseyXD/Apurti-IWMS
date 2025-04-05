/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "static.wixstatic.com",
      "ui.aceternity.com",
      "images.unsplash.com",
      "assets.aceternity.com",
      "github.com",
    ], // Add any other domains as needed
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  transpilePackages: ['three'],
};

export default nextConfig;
