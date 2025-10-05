import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type P = { slug: string };

export async function POST(_req: Request, { params }: { params: Promise<P> }) {
  const { slug } = await params;
  const s = decodeURIComponent(slug);

  const report = await prisma.report.findFirst({ where: { slug: s } });
  if (!report) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.report.update({
    where: { id: report.id },
    data: { likesCount: { increment: 1 } },
  });

  revalidatePath(`/reports/${encodeURIComponent(s)}`, "page");
  return NextResponse.json({ ok: true });
}
