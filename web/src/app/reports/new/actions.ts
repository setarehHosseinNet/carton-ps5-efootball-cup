"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID, createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

function slugifyFa(s: string) {
  return (s ?? "")
    .trim()
    .replace(/\u200c/g, "")                  // ZWNJ
    .replace(/[^\p{L}\p{N}\s_-]+/gu, "")     // ✅ خط تیره درست: _-
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function extFromName(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

export async function createReport(formData: FormData): Promise<void> {
  const me = await requireUser("/login");
  if (me.role !== "admin") throw new Error("اجازه دسترسی ندارید.");

  const title    = (formData.get("title") as string | null)?.trim() ?? "";
  const slugIn   = (formData.get("slug") as string | null) ?? "";
  const summary  = (formData.get("summary") as string | null)?.trim() || null;
  const content  = (formData.get("content") as string | null)?.trim() ?? "";

  if (!title || !content) throw new Error("عنوان و متن الزامی است.");

  // ساخت اسلاگ یکتا
  let base = slugifyFa(slugIn || title);
  if (!base) base = `post-${Date.now()}`;
  let slug = base, i = 2;
  while (await prisma.report.findUnique({ where: { slug } })) slug = `${base}-${i++}`;

  // آماده‌سازی مسیر آپلود (public/uploads/YYYY/MM)
  const now = new Date();
  const yy  = String(now.getFullYear());
  const mm  = String(now.getMonth() + 1).padStart(2, "0");
  const uploadsDir = path.join(process.cwd(), "public", "uploads", yy, mm);
  await fs.mkdir(uploadsDir, { recursive: true });

  // فایل‌ها از input name="media" می‌آیند
  const files = formData.getAll("media") as File[];
  const mediaCreates: { url: string; type: "IMAGE" | "VIDEO" }[] = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;
    if (!file.size) continue;

    const buf = Buffer.from(await file.arrayBuffer());
    const hash = createHash("sha1").update(buf).digest("hex").slice(0, 10);
    const safeBase = slugifyFa(file.name.replace(/\.[^.]*$/, "")) || "file";
    const ext = extFromName(file.name) || (file.type.startsWith("image/") ? ".jpg" : ".bin");
    const filename = `${safeBase}-${hash}-${randomUUID().slice(0, 8)}${ext}`;
    const abs = path.join(uploadsDir, filename);
    await fs.writeFile(abs, buf);

    const url = `/uploads/${yy}/${mm}/${filename}`;
    const type = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";
    mediaCreates.push({ url, type });
  }

  await prisma.$transaction(async (tx) => {
    await tx.report.create({
      data: {
        slug, title, summary, content,
        medias: mediaCreates.length
          ? { create: mediaCreates }
          : undefined,
      },
    });
  });

  revalidatePath("/reports");
  revalidatePath(`/reports/${slug}`);
  redirect(`/reports/${slug}?ok=1`);
}
