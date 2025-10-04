"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = { loggedIn?: boolean };

const PUBLIC_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/reports", label: "تابلو اعلانات" },
  { href: "/groups", label: "جدول گروه‌ها" },
  { href: "/fixtures", label: "برنامه بازی‌ها" },
];

const PRIVATE_LINKS = [
  { href: "/admin", label: "ثبت نتایج" },
  { href: "/reports/new", label: "گزارش جدید" },
];

export default function NavClient({ loggedIn = false }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const Item = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`no-underline px-3 py-2 rounded-xl text-sm transition
        ${isActive(href) ? "bg-black text-white shadow" : "text-slate-700 hover:bg-slate-200"}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center">
        {/* لوگو */}
        <Link href="/" className="no-underline font-extrabold tracking-tight flex items-center gap-2">
          <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-rose-600 to-pink-500" />
          <span className="text-slate-900">Carton</span>
          <span className="text-pink-600">eFootball</span>
          <span className="text-slate-500 text-xs mt-1">2025</span>
        </Link>

        <div className="flex-1" />

        {/* دسکتاپ: منو سمت راست */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-2 justify-end">
            {PUBLIC_LINKS.map((l) => <Item key={l.href} {...l} />)}
            {loggedIn && PRIVATE_LINKS.map((l) => <Item key={l.href} {...l} />)}
          </nav>

          {/* CTAها */}
          {loggedIn && (
            <Link
              href="/setup"
              className="no-underline rounded-2xl px-4 py-2 text-white bg-gradient-to-l from-rose-600 to-pink-600 hover:opacity-90 transition shadow"
            >
              شروع تورنمنت
            </Link>
          )}
          {loggedIn ? (
            <Link href="/logout" className="no-underline rounded-xl px-3 py-2 bg-slate-900 text-white hover:opacity-90">
              خروج
            </Link>
          ) : (
            <Link href="/login" className="no-underline rounded-xl px-3 py-2 bg-slate-900 text-white hover:opacity-90">
              ورود
            </Link>
          )}
        </div>

        {/* موبایل: منوی همبرگری */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden ms-auto p-2 rounded-lg hover:bg-slate-200"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          )}
        </button>
      </div>

      {/* پنل موبایل */}
      {open && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2 items-end text-right">
            {PUBLIC_LINKS.map((l) => <Item key={l.href} {...l} />)}
            {loggedIn && PRIVATE_LINKS.map((l) => <Item key={l.href} {...l} />)}

            <div className="flex gap-2">
              {loggedIn && (
                <Link
                  href="/setup"
                  onClick={() => setOpen(false)}
                  className="no-underline rounded-xl px-4 py-2 text-white bg-gradient-to-l from-rose-600 to-pink-600"
                >
                  شروع تورنمنت
                </Link>
              )}
              {loggedIn ? (
                <Link href="/logout" onClick={() => setOpen(false)} className="no-underline rounded-xl px-3 py-2 bg-slate-900 text-white">
                  خروج
                </Link>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="no-underline rounded-xl px-3 py-2 bg-slate-900 text-white">
                  ورود
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
