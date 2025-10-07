'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body dir="rtl" style={{ padding: 16 }}>
        <h2>یک خطای کلی رخ داد</h2>
        <button onClick={() => reset()}>تلاش مجدد</button>
      </body>
    </html>
  );
}
