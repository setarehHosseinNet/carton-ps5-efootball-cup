// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";            // 👈 مهم: بدون این، کلاس‌های Tailwind اعمال نمی‌شوند
import NavClient from "@/components/NavClient";
import { Vazirmatn } from "next/font/google";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Carton eFootball 2025",
  description: "PS5 eFootball tournament manager"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.className}>
      <body className="min-h-dvh text-slate-900 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="h-1 w-full bg-gradient-to-l from-rose-600 via-pink-600 to-fuchsia-600" />
        <NavClient />
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
        <footer className="border-t mt-10 py-6 text-center text-xs text-slate-500">
          © 2025 Carton Mohammad — eFootball PS5
        </footer>
      </body>
    </html>
  );
}
