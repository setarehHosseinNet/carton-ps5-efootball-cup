import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getFingerprint } from "@/lib/fingerprint";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const reportId = Number(params.id || 0);
  if (!Number.isFinite(reportId) || reportId <= 0) {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }

  // جلوگیری از لایک تکراری با اثرانگشت
  const fingerprint = getFingerprint();

  try {
    await prisma.like.create({ data: { reportId, fingerprint } });
    await prisma.report.update({
      where: { id: reportId },
      data: { likesCount: { increment: 1 } },
    });
  } catch {
    // اگر قبلاً لایک شده بود یا کانسترِینت یونیک خورد، بی‌صدا عبور کن
  }

  return NextResponse.json({ ok: true });
}
