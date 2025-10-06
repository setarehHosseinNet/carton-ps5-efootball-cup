"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateReport(slug: string, formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const summary = String(formData.get("summary") ?? "");
  const content = String(formData.get("content") ?? "");

  await prisma.report.update({
    where: { slug },
    data: { title, summary, content },
  });

  revalidatePath(`/reports/${slug}`, "page");
  revalidatePath(`/reports`, "page");
}

export async function deleteReportBySlug(slug: string) {
  await prisma.report.delete({ where: { slug } });
  revalidatePath(`/reports`, "page");
}
