import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertCleanOrThrow } from "@/lib/moderation";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const reportId = Number(params.id || 0);
  if (!Number.isFinite(reportId) || reportId <= 0) {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const author  = (body?.author  || "").toString().slice(0, 60).trim();
  const content = (body?.content || "").toString().trim();
  if (!content) {
    return NextResponse.json({ error: "متن نظر خالی است." }, { status: 400 });
  }

  try {
    // فیلتر ناسزا/الفاظ نامناسب
    assertCleanOrThrow(["author", author], ["content", content]);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "متن نامعتبر" }, { status: 400 });
  }

  // ثبت کامنت و به‌روزرسانی شمارنده
  const c = await prisma.comment.create({
    data: { reportId, author: author || null, content },
  });
  await prisma.report.update({
    where: { id: reportId },
    data: { commentsCount: { increment: 1 } },
  });

  return NextResponse.json({ ok: true, id: c.id });
}
