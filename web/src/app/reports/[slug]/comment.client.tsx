"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CommentForm({ reportSlug }: { reportSlug: string }) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit() {
    if (!content.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(reportSlug)}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, content }),
      });
      if (res.ok) {
        setAuthor(""); setContent("");
        router.refresh(); // لیست نظرات بروز شود
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        value={author}
        onChange={e => setAuthor(e.target.value)}
        placeholder="نام (اختیاری)"
        className="w-full border rounded p-2"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="نظر شما…"
        className="w-full border rounded p-2"
        rows={4}
      />
      <button onClick={submit} disabled={busy} className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-60">
        ارسال نظر
      </button>
    </div>
  );
}
