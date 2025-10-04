"use client";
import { useState } from "react";

export default function LikeButton({
  reportSlug,
  initialCount,
}: { reportSlug: string; initialCount: number }) {
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(initialCount);

  async function like() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/reports/${encodeURIComponent(reportSlug)}/like`,
        { method: "POST" }
      );
      if (res.ok) setCount((c) => c + 1);
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
