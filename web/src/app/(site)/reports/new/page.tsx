import { requireUser } from "@/lib/auth";
import { createReport } from "./actions";

export const dynamic = "force-dynamic";

export default async function NewReportPage() {
  await requireUser("/login");

  // رَپر تک‌آرگومانی برای Server Action
  async function submit(fd: FormData): Promise<void> {
    "use server";
    await createReport(fd);
  }

  return (
    <main className="container mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">گزارش جدید</h1>

      {/* برای آپلود فایل حتماً enctype */}
      <form action={submit} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className="block mb-1">عنوان</label>
          <input name="title" required className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block mb-1">خلاصه (اختیاری)</label>
          <input name="summary" className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block mb-1">متن</label>
          <textarea name="content" required className="w-full border rounded p-2 h-40" />
        </div>

        <div>
          <label className="block mb-1">مدیا (عکس/ویدیو) — قابل انتخاب چندگانه</label>
          <input
            name="media"
            type="file"
            multiple
            accept="image/*,video/*"
            className="block w-full border rounded p-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-slate-100"
          />
        </div>

        <button className="px-4 py-2 rounded bg-indigo-600 text-white">
          ذخیره
        </button>
      </form>
    </main>
  );
}
