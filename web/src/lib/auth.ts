// src/lib/auth.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import prisma from "@/lib/db";

const COOKIE = "sid";
const DAYS = 7;

// --- password helpers (برای ثبت‌نام/ورود) ---
export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

// --- session helpers ---
export async function createSession(userId: number) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + DAYS * 864e5);

  await prisma.session.create({ data: { id: token, userId, expiresAt } });

  const jar = await cookies(); // حتما await
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    try {
      await prisma.session.delete({ where: { id: token } });
    } catch {}
    jar.delete(COOKIE);
  }
}

export async function getSessionUser() {
  // این تابع فقط زمانی صدا زده شود که داخل ریکوئست هستیم
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const s = await prisma.session.findUnique({
    where: { id: token },
    include: { user: true },
  });
  if (!s || s.expiresAt < new Date()) {
    try { if (s) await prisma.session.delete({ where: { id: s.id } }); } catch {}
    jar.delete(COOKIE);
    return null;
  }
  return s.user;
}

/** اگر کاربر لاگین نبود به صفحه‌ی لاگین (با next) ریدایرکت می‌کنیم */
export async function requireUser(next?: string) {
  const u = await getSessionUser();
  if (!u) {
    const q = next ? `?next=${encodeURIComponent(next)}` : "";
    redirect(`/login${q}`);
  }
  return u;
}

export async function isLoggedIn() {
  const jar = await cookies();
  return !!jar.get(COOKIE)?.value;
}
/** تشخیص ادمین: اگر در اسکیما role داری از role==='ADMIN' استفاده کن.
 * اگر نداری، موقتاً با ایمیل‌های ENV قفل کن. */
function isAdminUser(u: any) {
  // روش ۱: مبتنی بر role (اگر داری)
  if (u?.role && String(u.role).toUpperCase() === "ADMIN") return true;

  // روش ۲: لیست ایمیل‌ها در env (مثال)
  const whitelist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (u?.email && whitelist.includes(String(u.email).toLowerCase())) return true;

  return false;
}

/** فقط ادمین دسترسی داشته باشد؛ در غیر این صورت ریدایرکت یا 404 کن */
export async function requireAdmin(next?: string) {
  const u = await getSessionUser();
  if (!u) {
    redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  }
  if (!isAdminUser(u)) {
    redirect("/"); // یا می‌تونی notFound() صدا بزنی
  }
  return u;
}

/** یوزری که ادمین نیست، UI مدیریتی نبیند */
export async function getCurrentUserIsAdmin() {
  const u = await getSessionUser();
  return !!u && isAdminUser(u);
}