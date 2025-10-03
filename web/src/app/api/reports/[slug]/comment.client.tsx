"use client";

import { useState } from "react";

export default function CommentForm({ reportId }: { reportId: number }) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState<string|null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch(`/api/reports/${reportId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setAuthor(""); setContent("");
      setMsg("ثبت شد ✅ صفحه را رفرش کنید تا ببینید.");
    } else {
      setMsg(data?.error || "خطا در ثبت نظر");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="نام (اختیاری)" className="w-full border rounded p-2"/>
      <textarea value={content} onChange={e=>setContent(e.target.value)} required rows={3} placeholder="نظر شما..." className="w-full border rounded p-2"/>
      <button className="px-3 py-2 rounded bg-emerald-600 text-white">ارسال نظر</button>
      {msg && <div className="text-sm text-slate-600">{msg}</div>}
    </form>
  );
}
