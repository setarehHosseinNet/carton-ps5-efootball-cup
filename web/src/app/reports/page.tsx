import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReportsList() {
  const items = await prisma.report.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    include: { medias: true },
    take: 50,
  });

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">گزارش‌ها</h1>
        <Link href="/reports/new" className="text-blue-600 hover:underline">+ ارسال گزارش</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map(r => {
          const cover = r.medias[0]?.url;
          return (
            <Link key={r.id} href={`/reports/${r.slug}`} className="border rounded p-4 hover:bg-slate-50">
              {cover && <img src={cover} alt="" className="rounded mb-3 max-h-48 object-cover w-full" />}
              <h2 className="font-bold text-lg mb-1">{r.title}</h2>
              <p className="text-slate-600 text-sm">{r.summary || r.content.slice(0,120)}…</p>
              <div className="text-sm text-slate-500 mt-1">❤️ {r.likesCount} · 💬 {r.commentsCount}</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
