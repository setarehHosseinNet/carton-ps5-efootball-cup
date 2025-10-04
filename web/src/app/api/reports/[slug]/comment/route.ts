import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

type Params = { slug: string };

export async function POST(req: Request, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const body = await req.json().catch(() => ({} as any));
  const author = (body.author ?? "").toString().slice(0, 80);
  const content = (body.content ?? "").toString().slice(0, 2000);

  const report = await prisma.report.findUnique({ where: { slug }, select: { id: true } });
  if (!report) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.comment.create({
    data: { reportId: report.id, author, content, approved: true },
  });
  await prisma.report.update({
    where: { id: report.id },
    data: { commentsCount: { increment: 1 } },
  });

  revalidatePath(`/reports/${slug}`);
  return NextResponse.json({ ok: true });
}
