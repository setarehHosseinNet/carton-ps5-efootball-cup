import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const d = new Date();
  const folder = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const ext = (file.name?.split(".").pop() || "bin").toLowerCase();
  const filename = `${crypto.randomUUID()}.${ext}`;
  await writeFile(path.join(uploadDir, filename), bytes);

  const url = `/uploads/${folder}/${filename}`; // مستقیماً از public سرو می‌شود
  return NextResponse.json({ url });
}
