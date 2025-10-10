"use client";

import { useState, useTransition } from "react";

export default function LikeButton({
  reportSlug,
  initialCount,
}: {
  reportSlug: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount ?? 0);
  const [pending, start] = useTransition();

  async function like() {
    start(async () => {
      // خوش‌بینانه
      setCount((c) => c + 1);

      const res = await fetch(
        `/api/reports/${encodeURIComponent(reportSlug)}/like`,
        { method: "POST" }
      );

      if (!res.ok) {
        // rollback
        setCount((c) => Math.max(0, c - 1));
      }
    });
  }

  return (
    <button
      onClick={like}
      disabled={pending}
      className="px-3 py-2 rounded bg-pink-600 text-white disabled:opacity-60"
    >
      ❤️ لایک ({count})
    </button>
  );
}
