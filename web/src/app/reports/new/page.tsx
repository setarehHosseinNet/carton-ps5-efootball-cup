import { createReport } from "./server-actions";

export default function NewReportPage() {
  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">ارسال گزارش</h1>
      <form action={createReport} className="space-y-4" encType="multipart/form-data">
        <div><label className="block mb-1">عنوان</label><input name="title" required className="w-full border rounded p-2" /></div>
        <div><label className="block mb-1">خلاصه</label><input name="summary" className="w-full border rounded p-2" /></div>
        <div><label className="block mb-1">متن گزارش</label><textarea name="content" required rows={8} className="w-full border rounded p-2" /></div>
        <div><label className="block mb-1">رسانه (تصویر/ویدئو)</label><input name="media" type="file" multiple accept="image/*,video/*" /></div>
        <button className="px-4 py-2 rounded bg-indigo-600 text-white">ثبت</button>
      </form>
    </main>
  );
}
