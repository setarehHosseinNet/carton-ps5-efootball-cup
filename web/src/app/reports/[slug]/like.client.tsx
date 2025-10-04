"use client";
import { useState } from "react";

export default function LikeButton({
  reportSlug,
  initialCount,
}: { reportSlug: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function onLike() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(reportSlug)}/like`, { method: "POST" });
      const json = await res.json();
      if (res.ok) setCount(json.count ?? count + 1);
      // اگر API فقط {ok:true} برگرداند، حداقل +1 خوشبینانه می‌زنیم.
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={onLike} disabled={busy} className="px-3 py-1 rounded bg-pink-600 text-white disabled:opacity-60">
      ❤️ لایک ({count})
    </button>
  );
}
