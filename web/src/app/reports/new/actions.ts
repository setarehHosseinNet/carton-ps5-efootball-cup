"use server";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";

function makeSlug(title: string) {
  const rand = Math.random().toString(36).slice(2, 8);
  // اگر می‌خواهی فارسی بماند اشکالی ندارد؛ فقط هنگام redirect انکد می‌کنیم
  return `${rand}--${title.trim().replace(/\s+/g, "-")}`;
}

export async function createReport(form: FormData) {
  const title   = String(form.get("title") ?? "").trim();
  const summary = String(form.get("summary") ?? "");
  const content = String(form.get("content") ?? "");
  const mediaUrl = String(form.get("mediaUrl") ?? ""); // از UploadField می‌آید

  if (!title) throw new Error("title is required");

  const slug = makeSlug(title);

  const report = await prisma.report.create({
    data: { title, summary, content, slug },
  });

  if (mediaUrl) {
    await prisma.media.create({
      data: {
        reportId: report.id,
        url: mediaUrl,
        type: /\.(mp4|mov|webm)$/i.test(mediaUrl) ? "VIDEO" : "IMAGE",
      },
    });
  }

  // نکته اصلی: URL باید ASCII باشد => انکد فقط روی slug
  redirect(`/reports/${encodeURIComponent(slug)}`);
}
