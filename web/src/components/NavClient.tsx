// src/components/NavClient.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
const pathname = usePathname() ?? '/';

type Props = {
  /** کاربر وارد شده است؟ */
  loggedIn?: boolean;
  /** اگر لاگین است و نقش مدیریتی دارد، لینک‌های مدیریتی بیشتری نمایش بده */
  isAdmin?: boolean;
};

const PUBLIC_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/reports", label: "تابلو اعلانات" },
  { href: "/groups", label: "جدول گروه‌ها" },
  { href: "/fixtures", label: "برنامه بازی‌ها" },
] as const;

const AUTH_LINKS = [
  { href: "/reports/new", label: "گزارش جدید" },
  { href: "/players", label: "بازیکن‌ها" },
  { href: "/matches", label: "بازی‌ها" },
] as const;

const ADMIN_LINKS = [
  { href: "/admin", label: "ثبت نتایج" },
  { href: "/setup", label: "شروع تورنمنت" },
] as const;

export default function NavClient({ loggedIn = false, isAdmin = false }: Props) {
  // usePathname ممکنه در برخی نسخه‌ها null برگردونه => ایمنش می‌کنیم
  const pathnameSafe = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // با تغییر مسیر، منوی موبایل بسته شود
  useEffect(() => {
    setOpen(false);
  }, [pathnameSafe]);

  const isActive = useMemo(
    () => (href: string) =>
      pathnameSafe === href ||
      (href !== "/" && pathnameSafe.startsWith(href)),
    [pathnameSafe]
  );

  const Item = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={[
        "no-underline px-3 py-2 rounded-xl text-sm transition",
        isActive(href)
          ? "bg-black text-white shadow"
          : "text-slate-700 hover:bg-slate-200",
      ].join(" ")}
    >
      {label}
    </Link>
  );

  /** دکمه خروج باید POST باشد؛ لینک GET قابل اتکا نیست */
  const LogoutButton = ({ className = "" }: { className?: string }) => (
    <form action="/logout" method="post">
      <button
        type="submit"
        className={
          "rounded-xl px-3 py-2 bg-slate-900 text-white hover:opacity-90 " +
          className
        }
      >
        خروج
      </button>
    </form>
  );

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur"
    >
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center">
        {/* لوگو */}
        <Link
          href="/"
          className="no-underline font-extrabold tracking-tight flex items-center gap-2"
          aria-label="Carton eFootball 2025 - خانه"
        >
          <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-rose-600 to-pink-500" />
          <span className="text-slate-900">Carton</span>
          <span className="text-pink-600">eFootball</span>
          <span className="text-slate-500 text-xs mt-1">2025</span>
        </Link>

        <div className="flex-1" />

        {/* دسکتاپ */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-2">
            {PUBLIC_LINKS.map((l) => (
              <Item key={l.href} {...l} />
            ))}

            {loggedIn &&
              AUTH_LINKS.map((l) => <Item key={l.href} {...l} />)}

            {loggedIn &&
              isAdmin &&
              ADMIN_LINKS.map((l) => <Item key={l.href} {...l} />)}
          </nav>

          <div className="ms-2 flex items-center gap-2">
            {!loggedIn ? (
              <Link
                href="/login"
                className="no-underline rounded-xl px-3 py-2 bg-slate-900 text-white hover:opacity-90"
              >
                ورود
              </Link>
            ) : (
              <LogoutButton />
            )}
          </div>
        </div>

        {/* موبایل */}
        <button
          aria-label="باز و بسته کردن منو"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden ms-auto p-2 rounded-lg hover:bg-slate-200"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* پنل موبایل */}
      <div
        id={panelId}
        className={[
          "md:hidden border-t border-black/5 bg-white transition-[max-height] overflow-hidden",
          open ? "max-h-[480px]" : "max-h-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2 items-end text-right">
          {PUBLIC_LINKS.map((l) => (
            <Item key={l.href} {...l} />
          ))}

          {loggedIn &&
            AUTH_LINKS.map((l) => <Item key={l.href} {...l} />)}

          {loggedIn &&
            isAdmin &&
            ADMIN_LINKS.map((l) => <Item key={l.href} {...l} />)}

          <div className="mt-2 flex gap-2">
            {!loggedIn ? (
              <Link
                href="/login"
                className="no-underline rounded-xl px-3 py-2 bg-slate-900 text-white hover:opacity-90"
              >
                ورود
              </Link>
            ) : (
              <LogoutButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
