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
      <h2>خطا در بارگذاری صفحه</h2>
      <p>{error?.message}</p>
      <button onClick={() => reset()}>تلاش مجدد</button>
    </div>
  );
}
