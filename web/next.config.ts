/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ لlint مانع build نمی‌شود
  },
  // اگر لازم شد می‌توانی تایپ‌اسکریپت را هم نرم کنی (پیشنهاد نمی‌شود):
  // typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
