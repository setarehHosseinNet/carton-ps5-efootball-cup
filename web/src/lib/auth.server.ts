import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import prisma from "@/lib/db";

const COOKIE = "sid";
const DAYS = 7;

// password
export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

// session
export async function createSession(userId: number) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + DAYS * 864e5);
  await prisma.session.create({ data: { id: token, userId, expiresAt } });

  // برای آرام کردن تایپینگ VSCode در بعضی تنظیمات:
  const jar: any = cookies(); // در Next 15 sync است؛ اگر تایپ خراب است any کن
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar: any = cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    try { await prisma.session.delete({ where: { id: token } }); } catch {}
    jar.delete(COOKIE);
  }
}

export async function getSessionUser() {
  const jar: any = cookies();
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

export async function requireUser(next?: string) {
  const u = await getSessionUser();
  if (!u) redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return u;
}

export async function isLoggedIn() {
  const jar: any = cookies();
  return !!jar.get(COOKIE)?.value;
}

function isAdminUser(u: any) {
  if (u?.role && String(u.role).toUpperCase() === "ADMIN") return true;
  const whitelist = (process.env.ADMIN_EMAILS || "")
    .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  return !!(u?.email && whitelist.includes(String(u.email).toLowerCase()));
}

export async function requireAdmin(next?: string) {
  const u = await getSessionUser();
  if (!u) redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  if (!isAdminUser(u)) redirect("/");
  return u;
}

export async function getCurrentUserIsAdmin() {
  const u = await getSessionUser();
  return !!u && isAdminUser(u);
}
