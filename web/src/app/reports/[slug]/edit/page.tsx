import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { deleteReportBySlug, updateReportBySlug } from "../actions";

export const dynamic = "force-dynamic"; // برای دسترسی به کوکی در ریکوئست

type Params = { slug: string };

function safeSlug(raw: string | null | undefined) {
  if (!raw) return null;
  try {
    const s = decodeURIComponent(raw).trim();
    return s || null;
  } catch {
    return null;
  }
}

export default async function EditReportPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const s = safeSlug(slug);
  if (!s) notFound();

  // فقط کاربر لاگین شده
  const me = await getSessionUser();
  if (!me) redirect(`/login?next=${encodeURIComponent(`/reports/${s}/edit`)}`);

  const report = await prisma.report.findFirst({
    where: { slug: s },
    select: { id: true, slug: true, title: true, summary: true, content: true },
  });
  if (!report) notFound();

  return (
    <main className="container mx-auto p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">ویرایش گزارش</h1>

      {/* فرم ویرایش */}
      <form action={updateReportBySlug.bind(null, s)} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm mb-1">عنوان</label>
          <input
            name="title"
            defaultValue={report.title ?? ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">خلاصه</label>
          <input
            name="summary"
            defaultValue={report.summary ?? ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">متن</label>
          <textarea
            name="content"
            rows={10}
            defaultValue={report.content ?? ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            ذخیره تغییرات
          </button>

          <a
            href={`/reports/${encodeURIComponent(s)}`}
            className="px-4 py-2 rounded border"
          >
            انصراف
          </a>
        </div>
      </form>

      {/* دکمه حذف */}
      <form
        action={deleteReportBySlug.bind(null, s)}
        className="mt-8"
      >
        <button
          type="submit"
          className="px-4 py-2 rounded bg-rose-600 text-white"
          // اگر خواستی قبل از حذف confirm بگیری، یک کلاینت‌کامپوننت کوچک بساز
        >
          حذف گزارش
        </button>
      </form>
    </main>
  );
}
