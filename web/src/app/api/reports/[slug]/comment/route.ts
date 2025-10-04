import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { assertCleanOrThrow } from "@/lib/moderation";

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params; // ← await
  const report = await prisma.report.findFirst({ where: { slug: decodeURIComponent(slug) } });
  if (!report) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { author?: string; content?: string } | null;
  const author = (body?.author || "").slice(0, 60).trim();
  const content = (body?.content || "").trim();
  if (!content) return NextResponse.json({ error: "bad content" }, { status: 400 });

  try { assertCleanOrThrow(["author", author], ["content", content]); } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  await prisma.comment.create({ data: { reportId: report.id, author: author || null, content } });
  await prisma.report.update({ where: { id: report.id }, data: { commentsCount: { increment: 1 } } });

  return NextResponse.json({ ok: true });
}
