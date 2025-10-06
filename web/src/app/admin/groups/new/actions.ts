"use server";
import prisma from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createGroupAction(_: any, formData: FormData) {
  await requireUser("/admin/groups/new");

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "نام گروه لازم است." };

  await prisma.group.create({ data: { name } });
  redirect("/groups"); // یا صفحهٔ موفقیت
}
