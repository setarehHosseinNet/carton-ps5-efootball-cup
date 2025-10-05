"use server";

import prisma from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = { ok: boolean; message?: string; slug?: string };

export async function updateReport(_: ActionState | undefined, formData: FormData): Promise<ActionState> {
  // فقط کاربر لاگین اجازه دارد
  await requireUser();

  const slug = String(formData.get("slug") || "");
  const title = String(formData.get("title") || "");
  const summary = String(formData.get("summary") || "");
  const content = String(formData.get("content") || "");

  if (!slug) return { ok: false, message: "شناسه گزارش نامعتبر است." };
  if (!title.trim()) return { ok: false, message: "عنوان الزامی است." };

  await prisma.report.update({
    where: { slug },
    data: { title, summary, content },
  });

  // رفرش لیست و صفحه‌ی جزئیات
  revalidatePath("/");
  revalidatePath(`/reports/${encodeURIComponent(slug)}`, "page");

  return { ok: true, slug };
}

export async function deleteReport(slug: string) {
  // فقط کاربر لاگین اجازه دارد
  await requireUser();

  await prisma.report.delete({ where: { slug } });

  // رفرش و برگشت به صفحه اصلی
  revalidatePath("/");
  redirect("/");
}
