import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const safeSlug = decodeURIComponent(slug);

  const report = await prisma.report.findFirst({ where: { slug: safeSlug }, select: { id: true, slug: true } });
  if (!report) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { author?: string; content?: string } | null;
  const author = (body?.author || "").slice(0, 60).trim();
  const content = (body?.content || "").trim();
  if (!content) return NextResponse.json({ error: "متن نظر الزامی است" }, { status: 400 });

  await prisma.comment.create({ data: { reportId: report.id, author: author || null, content, approved: true } });
  await prisma.report.update({ where: { id: report.id }, data: { commentsCount: { increment: 1 } } });

  revalidatePath(`/reports/${report.slug}`, "page");
  return NextResponse.json({ ok: true });
}
