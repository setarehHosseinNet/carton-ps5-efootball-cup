// src/lib/auth.ts
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import prisma from "@/lib/db";

/** نام کوکی نشست */
const COOKIE = "sid";

/** مدت اعتبار نشست (قابل تغییر با ENV) */
const DAYS = Number(process.env.SESSION_DAYS ?? 7);
const ONE_DAY_MS = 86_400_000;
const SESSION_MAX_AGE_MS = DAYS * ONE_DAY_MS;

/* ------------------------------- Password ------------------------------- */

/** هش کردن گذرواژه */
export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

/** راستی‌آزمایی گذرواژه با هش ذخیره‌شده */
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

/* -------------------------------- Session -------------------------------- */

type SessionUser = Awaited<ReturnType<typeof getSessionUser>>;

/** ایجاد نشست و نوشتن کوکی */
export async function createSession(userId: number) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  await prisma.session.create({ data: { id: token, userId, expiresAt } });

  const jar = await cookies(); // ← حتماً await
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** پایان‌دادن نشست فعلی (اگر باشد) و حذف کوکی */
export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return;

  try {
    await prisma.session.delete({ where: { id: token } });
  } catch {
    // ممکن است قبلاً حذف شده باشد
  }
  jar.delete(COOKIE);
}

/** خواندن نشست فعلی و برگرداندن کاربر (یا null) */
export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const s = await prisma.session.findUnique({
    where: { id: token },
    include: { user: true },
  });

  // اگر نشست پیدا نشد یا منقضی است، پاکش کن و کوکی را بردار
  if (!s || s.expiresAt < new Date()) {
    if (s) void prisma.session.delete({ where: { id: s.id } }).catch(() => {});
    jar.delete(COOKIE);
    return null;
  }

  return s.user; // { id, username, ... }
}

/** نیاز به ورود: اگر نبود، به لاگین ریدایرکت می‌کنیم */
export async function requireUser(next?: string) {
  const u = await getSessionUser();
  if (!u) {
    const qs = next ? `?next=${encodeURIComponent(next)}` : "";
    redirect(`/login${qs}`);
  }
  return u as NonNullable<SessionUser>;
}

/** فقط چِک می‌کند که کوکی نشست وجود دارد یا نه (Boolean) */
export async function isLoggedIn() {
  const jar = await cookies();
  return jar.has(COOKIE);
}
