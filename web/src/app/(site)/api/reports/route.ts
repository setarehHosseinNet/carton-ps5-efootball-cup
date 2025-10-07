// src/app/api/reports/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import slugify from "slugify";

export async function POST(req: Request) {
  const { title, summary, content, mediaUrls = [] } = await req.json();

  const slug = `${Math.random().toString(36).slice(2,8)}--` +
    slugify(String(title), { lower: true, strict: true, locale: "fa" });

  const report = await prisma.report.create({
    data: { title, summary, content, slug },
  });

  if (Array.isArray(mediaUrls) && mediaUrls.length) {
    await prisma.media.createMany({
      data: mediaUrls.map((url: string) => ({
        reportId: report.id,
        type: url.match(/\.(mp4|mov|mkv)$/i) ? "VIDEO" : "IMAGE",
        url,
      })),
    });
  }

  return NextResponse.json({ id: report.id, slug: report.slug });
}
