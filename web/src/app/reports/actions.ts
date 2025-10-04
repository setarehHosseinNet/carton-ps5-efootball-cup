"use server";

import prisma from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { revalidatePath, redirect } from "next/navigation";

/** حذف گزارش با اسلاگ */
export async function deleteReportBySlug(slug: string) {
  await requireUser(); // فقط لاگین
  await prisma.report.delete({ where: { slug } }); // slug باید Unique باشد
  revalidatePath("/");      // لیست صفحه اول (تابلو) را تازه کن
  revalidatePath("/reports");
  redirect("/");            // برگرد به تابلو
}

/** بروزرسانی فیلدهای ساده‌ی گزارش */
export async function updateReportBySlug(
  slug: string,
  formData: FormData
) {
  await requireUser(); // فقط لاگین
  const title   = String(formData.get("title")   ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title) throw new Error("عنوان الزامی است.");

  await prisma.report.update({
    where: { slug },
    data : { title, summary, content },
  });

  revalidatePath(`/reports/${slug}`);
  redirect(`/reports/${slug}`);
}
