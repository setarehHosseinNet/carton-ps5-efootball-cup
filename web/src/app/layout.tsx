import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { isLoggedIn } from "@/lib/auth";
import NavClient from "@/components/NavClient";
import "./globals.css";
export default async function RootLayout({ children }: { children: ReactNode }) {
    // اگر فقط از کوکی می‌خوای بفهمی لاگین هست یا نه:
    const cookieStore = await cookies();                    // ✅ داخل تابع و await
    const sid = cookieStore.get("sid")?.value;
    const loggedIn = !!sid;


  return (
    <html dir="rtl" lang="fa">
      <body>
        <NavClient loggedIn={loggedIn} />
        {children}
      </body>
    </html>
  );
}
