// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // لزوماً توصیه نمی‌شود، ولی مانع build نمی‌شود
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  // اگر هشدار workspace/lockfile می‌گیری (monorepo)، مسیر ریشه را صریح اعلام کن:
  // outputFileTracingRoot: process.cwd(),
  // اگر پکیج‌های محلی داری که باید transpile شوند:
  // transpilePackages: ['your-local-pkg'],
};

export default nextConfig;
