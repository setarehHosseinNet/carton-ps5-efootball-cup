"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function deleteReportBySlug(rawSlug: string) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const slug = decodeURIComponent(rawSlug);

  const r = await prisma.report.findUnique({ where: { slug } });
  if (!r) return;

  await prisma.report.delete({ where: { id: r.id } });

  // مسیرها را تازه کن
  revalidatePath("/reports");
  revalidatePath(`/reports/${encodeURIComponent(slug)}`);
}
