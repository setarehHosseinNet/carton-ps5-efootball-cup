// src/app/reports/route.ts
export const dynamic = "force-dynamic";

import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { MediaType } from "@prisma/client";

/** اسلاگ‌ساز سبک */
function baseSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s\u200c]+/g, "-")
    .replace(/[^0-9a-z\-آ-ی]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function makeUniqueSlug(title: string) {
  const head = baseSlug(title) || "report";
  let slug = head, i = 0;
  while (true) {
    const exists = await prisma.report.findUnique({ where: { slug } });
    if (!exists) return slug;
    i += 1;
    slug = `${head}-${i}`;
    if (i > 50) return `${head}-${Date.now().toString(36)}`;
  }
}

function detectMediaType(url: string): MediaType {
  const ext = (url.split(".").pop() || "").toLowerCase();
  return ["mp4", "webm", "mov", "m4v"].includes(ext) ? MediaType.VIDEO : MediaType.IMAGE;
}

export async function POST(req: Request) {
  try {
    const { title, summary = "", content = "", mediaUrls = [] } = await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "عنوان الزامی است." }, { status: 400 });
    }
    if (!Array.isArray(mediaUrls)) {
      return NextResponse.json({ error: "mediaUrls باید آرایه باشد." }, { status: 400 });
    }

    const slug = await makeUniqueSlug(title);

    // اول خودِ گزارش
    const created = await prisma.report.create({
      data: {
        slug,
        title,
        summary: summary || null,
        content: content || "",
        likesCount: 0,
        commentsCount: 0,
      },
    });

    // سپس مدیاها (بدون فیلد order)
    if (mediaUrls.length) {
      await prisma.media.createMany({
        data: mediaUrls.map((url: string) => ({
          reportId: created.id,
          url,
          type: detectMediaType(url),
        })),
      });
    }

    revalidatePath("/reports");
    return NextResponse.json({ slug: created.slug }, { status: 201 });
  } catch (err: any) {
    console.error("POST /reports error:", err);
    return NextResponse.json(
      { error: err?.message ?? "خطای سرور در ساخت گزارش" },
      { status: 500 }
    );
  }
}
