import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import prisma from "@/lib/db";

const COOKIE = "sid";
const DAYS = 7;

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSession(userId: number) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + DAYS * 864e5);
  await prisma.session.create({ data: { id: token, userId, expiresAt } });

  const jar = await cookies();
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
    try { await prisma.session.delete({ where: { id: token } }); } catch {}
    jar.delete(COOKIE);
  }
}

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const s = await prisma.session.findUnique({
    where: { id: token },
    include: { user: true },
  });

  if (!s || s.expiresAt < new Date()) {
    if (s) { try { await prisma.session.delete({ where: { id: s.id } }); } catch {} }
    jar.delete(COOKIE);
    return null;
  }
  return s.user;
}

export async function isLoggedIn() {
  const jar = await cookies();
  return jar.has(COOKIE);
}
