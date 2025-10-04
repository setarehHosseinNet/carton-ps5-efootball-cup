import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { assertCleanOrThrow } from "@/lib/moderation";
import { saveFilesFromForm } from "@/lib/upload";
import { nanoid } from "nanoid";
import Link from "next/link";

export const metadata: Metadata = { title: "گزارش جدید" };

async function createReport(formData: FormData) {
  "use server";
  const title = (formData.get("title") as string || "").trim();
  const summary = (formData.get("summary") as string || "").trim();
  const content = (formData.get("content") as string || "").trim();
  const mediaFiles = formData.getAll("media") as File[];

  if (!title || !content) throw new Error("تیتر و متن الزامی است.");
  assertCleanOrThrow(["title", title], ["summary", summary], ["content", content]);

  const saved = await saveFilesFromForm(mediaFiles);

  const slug = `${nanoid(8)}-${title.replace(/\s+/g,"-").slice(0,40)}`;

  const report = await prisma.report.create({
    data: {
      slug, title, summary, content,
      medias: {
        create: saved.map(s => ({
          type: s.type,
          url: s.url,
          width: s.width,
          height: s.height,
          duration: s.duration
        }))
      }
    }
  });

  return { ok: true, slug: report.slug };
}

export default function NewReportPage() {
  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">افزودن گزارش مسابقه</h1>

      <form action={createReport} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block mb-1">تیتر*</label>
          <input name="title" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">خلاصه</label>
          <input name="summary" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">متن گزارش*</label>
          <textarea name="content" required rows={8} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">مدیا (عکس/ویدیو، چندتایی مجاز)</label>
          <input name="media" type="file" multiple accept="image/*,video/*" />
        </div>

        <button className="btn btn-primary px-4 py-2 rounded bg-indigo-600 text-white">ثبت</button>
      </form>

      <div className="mt-6">
        <Link href="/reports" className="text-blue-600 hover:underline">بازگشت به فهرست گزارش‌ها</Link>
      </div>
    </main>
  );
}

