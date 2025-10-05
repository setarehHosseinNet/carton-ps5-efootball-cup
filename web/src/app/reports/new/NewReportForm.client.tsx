"use client";

import * as React from "react";

export default function NewReportForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const title   = (form.elements.namedItem("title")   as HTMLInputElement).value.trim();
    const summary = (form.elements.namedItem("summary") as HTMLInputElement).value.trim();
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value;
    const files   = (form.elements.namedItem("files")   as HTMLInputElement).files;

    try {
      const mediaUrls: string[] = [];
      if (files && files.length) {
        for (const f of Array.from(files)) {
          const fd = new FormData();
          fd.append("file", f);
          const up = await fetch("/api/upload", { method: "POST", body: fd });
          if (!up.ok) throw new Error(`آپلود شکست خورد (${up.status})`);
          const { url } = (await up.json()) as { url?: string };
          if (!url) throw new Error("پاسخ آپلود معتبر نیست");
          mediaUrls.push(url);
        }
      }

      const res = await fetch("/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, content, mediaUrls }),
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || `ایجاد گزارش ناموفق (${res.status})`);
      const data = safeJson(txt) as { slug?: string };

      window.location.assign(
        data?.slug ? `/reports/${encodeURIComponent(data.slug)}` : "/reports"
      );
    } catch (err: any) {
      setError(err?.message || "خطای ناشناخته");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <label className="block mb-1 font-medium">تیتر</label>
        <input name="title" required className="w-full rounded border p-2" placeholder="تیتر گزارش" />
      </div>

      <div>
        <label className="block mb-1 font-medium">خلاصه</label>
        <input name="summary" className="w-full rounded border p-2" placeholder="خلاصه کوتاه (اختیاری)" />
      </div>

      <div>
        <label className="block mb-1 font-medium">متن</label>
        <textarea name="content" rows={8} className="w-full rounded border p-2" placeholder="متن گزارش" />
      </div>

      <div>
        <label className="block mb-1 font-medium">عکس/ویدیو (اختیاری)</label>
        <input name="files" type="file" multiple className="block" />
        <p className="text-xs text-slate-500 mt-1">ابتدا فایل‌ها آپلود می‌شوند، سپس URL آن‌ها ثبت می‌گردد.</p>
      </div>

      {error && <p className="text-rose-600 text-sm">{error}</p>}

      <button type="submit" disabled={submitting} className="rounded px-4 py-2 bg-black text-white disabled:opacity-60">
        {submitting ? "در حال ارسال…" : "ایجاد گزارش"}
      </button>
    </form>
  );
}

function safeJson(t: string) {
  try { return JSON.parse(t); } catch { return {}; }
}
