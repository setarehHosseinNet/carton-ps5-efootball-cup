"use server";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createUserAction(_: any, formData: FormData) {
  const me = await requireUser("/admin/users/new"); // فقط کاربر لاگین‌دار
  if (me.role !== "admin") throw new Error("دسترسی ندارید.");

  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "user");

  if (!username || !password) return { error: "نام کاربری و رمز لازم است." };

  const passwordHash = await hashPassword(password);
  await prisma.user.create({ data: { username, passwordHash, role } });
  redirect("/admin/users/new?ok=1");
}
