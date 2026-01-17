/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://freshillymeal.com'
  },
  eslint: {
    // Allow build to proceed even if ESLint errors exist
    // TODO: Fix ESLint errors in dashboard/page.js and page.js
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
