export const metadata = { title: "Carton PS5 eFootball Cup" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-dvh bg-slate-50">{children}</body>
    </html>
  );
}
