"use client";
import { useState } from "react";

export default function LikeButton({
  slug,
  initialCount,
}: { slug: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function like() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(slug)}/like`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && typeof data.count === "number") setCount(data.count);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={like}
      disabled={busy}
      className="px-3 py-2 rounded bg-pink-600 text-white disabled:opacity-50"
    >
      ❤️ لایک ({count})
    </button>
  );
}
