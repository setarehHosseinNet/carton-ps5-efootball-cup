// src/app/layout.tsx  (SERVER ONLY)
export const dynamic = 'force-dynamic';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'کارتن PS5 ای‌فوتبال کاپ',
  description: 'سامانه مسابقات و گزارش‌ها',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html dir="rtl" lang="fa">
      <body>
        {children}
      </body>
    </html>
  );
}
