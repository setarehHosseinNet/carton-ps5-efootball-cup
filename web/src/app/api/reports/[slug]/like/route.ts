import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

type Params = { slug: string };

export async function POST(_req: Request, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const report = await prisma.report.findUnique({ where: { slug } });
  if (!report) return NextResponse.json({ error: "not found" }, { status: 404 });

  const updated = await prisma.report.update({
    where: { id: report.id },
    data: { likesCount: { increment: 1 } },
    select: { likesCount: true },
  });

  revalidatePath(`/reports/${slug}`);
  return NextResponse.json({ ok: true, count: updated.likesCount });
}
