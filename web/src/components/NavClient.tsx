"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "تابلو اعلانات" },
  { href: "/reports/new", label: "گزارش جدید" },
  { href: "/setup", label: "راه‌اندازی" },
  { href: "/fixtures", label: "برنامه بازی‌ها" },
  { href: "/admin", label: "ثبت نتایج" },
  { href: "/groups", label: "جدول گروه‌ها" }
];

export default function NavClient() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const Item = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`no-underline px-3 py-2 rounded-xl text-sm transition
        ${isActive(href)
          ? "bg-black text-white shadow"
          : "text-slate-700 hover:bg-slate-200"}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
        {/* برند */}
        <Link href="/" className="no-underline font-extrabold tracking-tight flex items-center gap-2">
          <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-rose-600 to-pink-500" />
          <span className="text-slate-900">Carton</span>
          <span className="text-pink-600">eFootball</span>
          <span className="text-slate-500 text-xs mt-1">2025</span>
        </Link>

        {/* منوی دسکتاپ */}
        <nav className="hidden md:flex items-center gap-2">
          {LINKS.map((l) => <Item key={l.href} {...l} />)}
          <Link
            href="/setup"
            className="no-underline ms-2 rounded-2xl px-4 py-2 text-white bg-gradient-to-l from-rose-600 to-pink-600 hover:opacity-90 transition shadow"
          >
            شروع تورنمنت
          </Link>
        </nav>

        {/* دکمه همبرگری موبایل */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-200"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* پنل موبایل */}
      {open && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
            {LINKS.map((l) => <Item key={l.href} {...l} />)}
            <Link
              href="/setup"
              onClick={() => setOpen(false)}
              className="no-underline mt-1 rounded-xl px-4 py-2 text-center text-white bg-gradient-to-l from-rose-600 to-pink-600"
            >
              شروع تورنمنت
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
