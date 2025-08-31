/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Add this for Google Analytics
  env: {
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
  },
  // Add i18n configuration
  i18n: {
    locales: ['en', 'ta', 'si'],
    defaultLocale: 'en',
    localeDetection: true,
  },
};

export default nextConfig;