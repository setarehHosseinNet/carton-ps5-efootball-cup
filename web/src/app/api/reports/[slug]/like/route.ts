import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

function fp(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "";
  const ua = req.headers.get("user-agent") || "";
  return crypto.createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 32);
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const safeSlug = decodeURIComponent(slug);

  const report = await prisma.report.findFirst({ where: { slug: safeSlug }, select: { id: true, slug: true } });
  if (!report) return NextResponse.json({ error: "not found" }, { status: 404 });

  const fingerprint = fp(req);

  try {
    await prisma.like.create({ data: { reportId: report.id, fingerprint } });
    await prisma.report.update({ where: { id: report.id }, data: { likesCount: { increment: 1 } } });
  } catch {
    // اگر قبلاً لایک شده بود، create خطای unique می‌دهد؛ در این صورت افزایش نمی‌دهیم
  }

  const fresh = await prisma.report.findUnique({ where: { id: report.id }, select: { likesCount: true } });

  revalidatePath(`/reports/${report.slug}`, "page");
  return NextResponse.json({ ok: true, count: fresh?.likesCount ?? 0 });
}
