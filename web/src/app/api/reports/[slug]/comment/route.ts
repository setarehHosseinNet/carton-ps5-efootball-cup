import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type P = { slug: string };

export async function POST(req: Request, { params }: { params: Promise<P> }) {
  const { slug } = await params;
  const s = decodeURIComponent(slug);

  const body = await req.json().catch(() => ({}));
  const author =
    typeof body.author === "string" && body.author.trim() ? body.author.trim() : null;
  const content =
    typeof body.content === "string" ? body.content.trim() : "";

  const report = await prisma.report.findFirst({ where: { slug: s } });
  if (!report) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!content) return NextResponse.json({ error: "empty" }, { status: 400 });

  await prisma.comment.create({
    data: { reportId: report.id, author, content, approved: true },
  });

  await prisma.report.update({
    where: { id: report.id },
    data: { commentsCount: { increment: 1 } },
  });

  revalidatePath(`/reports/${encodeURIComponent(s)}`, "page");
  return NextResponse.json({ ok: true });
}
