"use client";

import { useState, useTransition } from "react";

export default function CommentForm({ reportSlug }: { reportSlug: string }) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    start(async () => {
      setMsg(null);
      const res = await fetch(
        `/api/reports/${encodeURIComponent(reportSlug)}/comment`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            author: author.trim() || null,
            content: content.trim(),
          }),
        }
      );

      if (res.ok) {
        setAuthor("");
        setContent("");
        setMsg("نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود.");
      } else {
        setMsg("ارسال نظر ناموفق بود.");
      }
    });
  };

  return (
    <form onSubmit={submit} className="border rounded p-4 space-y-3">
      <h3 className="font-bold">ارسال نظر</h3>
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="نام (اختیاری)"
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="متن نظر شما…"
        className="w-full border rounded px-3 py-2 min-h-[120px]"
      />
      <div className="flex items-center gap-3">
        <button
          disabled={pending}
          className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
        >
          ارسال نظر
        </button>
        {msg && <span className="text-slate-600 text-sm">{msg}</span>}
      </div>
    </form>
  );
}
