import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params; // ← await
  const report = await prisma.report.findFirst({ where: { slug: decodeURIComponent(slug) } });
  if (!report) return NextResponse.json({ error: "not found" }, { status: 404 });

  try {
    await prisma.like.create({ data: { reportId: report.id, fingerprint: "anon" } });
    await prisma.report.update({ where: { id: report.id }, data: { likesCount: { increment: 1 } } });
  } catch {}
  return NextResponse.json({ ok: true });
}
