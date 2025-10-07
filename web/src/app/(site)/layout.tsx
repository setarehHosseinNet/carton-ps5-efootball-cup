export const dynamic = 'force-dynamic';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = { title:'...', description:'...' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html dir="rtl" lang="fa"><body>{children}</body></html>);
}
