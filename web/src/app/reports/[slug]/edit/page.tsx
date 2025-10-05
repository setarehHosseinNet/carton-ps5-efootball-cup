import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { updateReport, deleteReport } from "../actions";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function EditReportPage({
  params,
}: {
  params: Promise<Params>;
}) {
  // فقط کاربر وارد شده
  await requireUser();

  // Next 15: پارامترها Promise هستند
  const { slug } = await params;

  const report = await prisma.report.findUnique({
    where: { slug },
    select: { slug: true, title: true, summary: true, content: true },
  });

  if (!report) notFound();

  return (
    <main dir="rtl" className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ویرایش گزارش</h1>

      {/* فرم ویرایش */}
      <form action={updateReport} className="space-y-4 max-w-2xl">
        <input type="hidden" name="slug" value={report.slug} />

        <div>
          <label className="block mb-1 text-sm font-medium">عنوان</label>
          <input
            name="title"
            defaultValue={report.title}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">خلاصه</label>
          <input
            name="summary"
            defaultValue={report.summary ?? ""}
            className="w-full rounded border p-2"
            placeholder="اختیاری"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">متن کامل</label>
          <textarea
            name="content"
            defaultValue={report.content ?? ""}
            className="w-full rounded border p-2 h-48"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-emerald-600 text-white"
          >
            ذخیره تغییرات
          </button>
        </div>
      </form>

      {/* حذف گزارش (فقط لاگین‌شده) */}
      <form action={deleteReport.bind(null, report.slug)} className="mt-8">
        <button
          className="px-4 py-2 rounded bg-rose-600 text-white"
          // در صورت نیاز یک کامپوننت کلاینتی برای confirm اضافه کن
        >
          حذف گزارش
        </button>
      </form>
    </main>
  );
}
