'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div dir="rtl" style={{ padding: 16 }}>
      <h2>اشکال در این صفحه</h2>
      <button onClick={() => reset()}>تلاش مجدد</button>
      {process.env.NODE_ENV !== 'production' && (
        <pre suppressHydrationWarning>{error?.message}</pre>
      )}
    </div>
  );
}
