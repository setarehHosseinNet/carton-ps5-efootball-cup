"use client";
import { useState } from "react";

export default function LikeButton({ slug, initialCount }: { slug: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function like() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/reports/${slug}/like`, { method: "POST" });
      if (res.ok) setCount(c => c + 1);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={like} disabled={busy} className="px-3 py-2 rounded bg-pink-600 text-white">
      ❤️ لایک ({count})
    </button>
  );
}
