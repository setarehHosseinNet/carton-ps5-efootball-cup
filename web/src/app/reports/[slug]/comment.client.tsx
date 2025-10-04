"use client";
import { useState } from "react";

export default function CommentForm({ slug }: { slug: string }) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/reports/${encodeURIComponent(slug)}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author, content }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setAuthor("");
        setContent("");
        setMsg("ثبت شد ✅ (پس از تأیید نمایش داده می‌شود)");
      } else {
        setMsg(data.error || "خطا در ثبت نظر");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="نام (اختیاری)"
        className="w-full border rounded p-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        placeholder="نظر شما..."
        className="w-full border rounded p-2"
      />
      <button
        className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-50"
        disabled={busy}
      >
        ارسال نظر
      </button>
      {msg && <div className="text-sm text-slate-600">{msg}</div>}
    </form>
  );
}
