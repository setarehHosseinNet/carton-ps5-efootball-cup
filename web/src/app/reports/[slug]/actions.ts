"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

/** ویرایش */
export async function updateReportBySlug(slug: string, formData: FormData) {
  await requireUser(`/reports/${encodeURIComponent(slug)}/edit`);

  const title   = (formData.get("title") as string | null)?.trim() ?? "";
  const summary = (formData.get("summary") as string | null)?.trim() ?? "";
  const content = (formData.get("content") as string | null)?.trim() ?? "";

  await prisma.report.update({
    where: { slug },
    data: { title, summary, content },
  });

  revalidatePath(`/reports/${encodeURIComponent(slug)}`, "page");
  redirect(`/reports/${encodeURIComponent(slug)}`);
}

/** حذف کامل گزارش + وابستگی‌ها */
export async function deleteReportBySlug(slug: string) {
  await requireUser(`/reports/${encodeURIComponent(slug)}/edit`);

  // فقط id لازم داریم
  const report = await prisma.report.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!report) return;

  await prisma.$transaction([
    prisma.media.deleteMany({ where: { reportId: report.id } }),
    prisma.like.deleteMany({ where: { reportId: report.id } }),
    prisma.comment.deleteMany({ where: { reportId: report.id } }),
    prisma.report.delete({ where: { id: report.id } }),
  ]);

  revalidatePath("/reports", "page");
  redirect("/reports");
}
