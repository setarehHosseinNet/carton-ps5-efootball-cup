"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, createSession, verifyPassword } from "@/lib/auth";
import prisma from "@/lib/db";

/**
 * Server Action: لاگین با username/password
 * - در صورت موفقیت: کوکی سشن ست و redirect به next یا "/"
 * - در صورت خطا: redirect به /login?error=... (برای نمایش پیام)
 */
export async function loginAction(fd: FormData): Promise<void> {
    const username = String(fd.get("username") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const next = String(fd.get("next") ?? "/");

    if (!username || !password) {
        redirect("/login?error=empty");
    }

    // ⚠️ نام فیلدهای مدل را با اسکیما خودت هماهنگ کن
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        redirect("/login?error=invalid");
    }

    // اگر در مدل تو فیلد هش اسمش 'passwordHash' نیست، اینجا اصلاحش کن
    const hash = (user as any).passwordHash ?? (user as any).password;
    const ok = await verifyPassword(password, hash);
    if (!ok) {
        redirect("/login?error=invalid");
    }

    const { token, expiresAt } = await createSession(user.id);

    // در Server Action مجازه که کوکی‌ها تغییر کنه (Next 15 → await cookies())
    const jar = await cookies();
    jar.set({
        name: COOKIE, // "sid"
        value: token,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
    });

    // مقصد
    redirect(next.startsWith("/") ? next : "/");
}
