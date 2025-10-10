"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">خطای سرور</h1>
        {error.digest && (
          <p className="text-sm text-slate-500 mb-4">Digest: {error.digest}</p>
        )}
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded bg-indigo-600 text-white"
        >
          تلاش دوباره
        </button>
      </body>
    </html>
  );
}
