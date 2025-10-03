"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("SSR error:", error);
  }, [error]);

  return (
    <html dir="rtl">
      <body className="p-6">
        <h1 className="text-2xl font-bold mb-2">خطای سرور</h1>
        <p className="text-sm text-slate-600 mb-4">
          {error?.message || "اشکالی رخ داده است."}
        </p>
        <button
          onClick={() => reset()}
          className="px-3 py-2 rounded bg-black text-white"
        >
          تلاش دوباره
        </button>
      </body>
    </html>
  );
}
