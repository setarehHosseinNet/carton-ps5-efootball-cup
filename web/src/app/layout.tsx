import type { ReactNode } from "react";
import { isLoggedIn } from "@/lib/auth";
import NavClient from "@/components/NavClient";
import "./globals.css";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const loggedIn = await isLoggedIn();

  return (
    <html dir="rtl" lang="fa">
      <body>
        <NavClient loggedIn={loggedIn} />
        {children}
      </body>
    </html>
  );
}
