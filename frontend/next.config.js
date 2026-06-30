/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  // Redirects are handled in firebase.json for static export
};

module.exports = nextConfig;
