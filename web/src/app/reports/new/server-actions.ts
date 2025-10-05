"use server";

import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";
import { saveFilesFromForm } from "@/lib/uploads";
import { assertCleanOrThrow } from "@/lib/moderation";
import { revalidatePath, redirect } from "next/navigation";

export async function createReport(formData: FormData) {
  const title   = (formData.get("title")   as string || "").trim();
  const summary = (formData.get("summary") as string || "").trim();
  const content = (formData.get("content") as string || "").trim();
  const files   = formData.getAll("media") as File[];

  if (!title || !content) throw new Error("عنوان و متن گزارش الزامی است.");
  await assertCleanOrThrow({ title, summary, content });

  const medias = await saveFilesFromForm(files);
  const slug = nanoid(8);

  const report = await prisma.report.create({
    data: {
      slug, title, summary, content,
      medias: { create: medias.map(m => ({ type: m.type as any, url: m.url })) }
    }
  });

  revalidatePath("/reports");
  redirect(`/reports/${report.slug}`);
}
