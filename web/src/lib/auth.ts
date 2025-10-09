// src/lib/auth.ts
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import prisma from "@/lib/db";

// helper: cookies() در Next 15 باید await شود
const reqCookies = async (): Promise<ReadonlyRequestCookies> =>
    ((await cookies()) as unknown as ReadonlyRequestCookies);

export const COOKIE = "sid";
const DAYS = 7;

/* ============== Password ============== */
export async function hashPassword(plain: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
}
export async function verifyPassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
}

/* ============== Session (DB-only) ============== */
// فقط رکورد DB را می‌سازد؛ ست‌کردن کوکی در route/action
export async function createSession(userId: number) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + DAYS * 864e5);
    await prisma.session.create({ data: { id: token, userId, expiresAt } });
    return { token, expiresAt };
}

// رکورد DB را حذف می‌کند؛ پاک‌کردن کوکی در route/action
export async function destroySession() {
    const token = (await reqCookies()).get(COOKIE)?.value;
    if (!token) return false;
    try {
        await prisma.session.delete({ where: { id: token } });
        return true;
    } catch {
        return false;
    }
}

// کاربر سشن فعلی؛ اگر منقضی/نامعتبر بود null (بدون دست‌کاری کوکی)
export async function getSessionUser() {
    const token = (await reqCookies()).get(COOKIE)?.value;
    if (!token) return null;

    const s = await prisma.session.findUnique({
        where: { id: token },
        include: { user: true },
    });

    if (!s || s.expiresAt < new Date()) {
        try { if (s) await prisma.session.delete({ where: { id: s.id } }); } catch {}
        return null;
    }
    return s.user;
}

// presence سادهٔ کوکی (بدون تماس DB)
export async function isLoggedIn(): Promise<boolean> {
    return !!(await reqCookies()).get(COOKIE)?.value;
}

// اگر لاگین نبود به /login ریدایرکت می‌کند
export async function requireUser(next?: string) {
    const u = await getSessionUser();
    if (!u) {
        const q = next ? `?next=${encodeURIComponent(next)}` : "";
        redirect(`/login${q}`);
    }
    return u;
}
// ===== Admin helpers =====

// با مدل خودت هم‌راستا کن: اگر user.role داری همونو استفاده کن، وگرنه لیست ایمیل‌ها/یوزرنیم‌ها
function isAdminUser(u: any): boolean {
    // اگر فیلد role داری:
    if (u?.role && String(u.role).toUpperCase() === "ADMIN") return true;

    // اگر بر اساس username می‌خوای:
    const userWhitelist = (process.env.ADMIN_USERS || "")
        .split(",")
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
    if (u?.username && userWhitelist.includes(String(u.username).toLowerCase())) return true;

    // اگر بر اساس email می‌خوای (اختیاری):
    const emailWhitelist = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
    if (u?.email && emailWhitelist.includes(String(u.email).toLowerCase())) return true;

    return false;
}

export async function getCurrentUserIsAdmin(): Promise<boolean> {
    const user = await getSessionUser();   // همینی که قبلاً در auth.ts نوشتی
    return !!user && isAdminUser(user);
}

export async function requireAdmin(next?: string) {
    const user = await getSessionUser();
    if (!user) {
        // اگر next خواستی:
        // const q = next ? `?next=${encodeURIComponent(next)}` : "";
        // redirect(`/login${q}`);
        // ساده‌تر:
        redirect("/login");
    }
    if (!isAdminUser(user)) {
        redirect("/"); // یا notFound()
    }
    return user;
}
