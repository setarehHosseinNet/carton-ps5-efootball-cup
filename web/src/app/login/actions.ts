"use server";

import prisma from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const next = String(formData.get("next") ?? "/") || "/";

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return { ok: false, error: "نام کاربری یا رمز نادرست است" };

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return { ok: false, error: "نام کاربری یا رمز نادرست است" };

  await createSession(user.id);
  redirect(next);
}
