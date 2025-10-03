import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { medias: true },
    take: 50,
  });

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">تابلو اعلانات</h1>
        <Link href="/reports/new" className="no-underline rounded-xl px-4 py-2 bg-black text-white">
          گزارش جدید
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((r) => {
          const cover = r.medias[0]?.url;
          return (
            <Link
              key={r.id}
              href={`/reports/${encodeURIComponent(r.slug)}`}
              className="block no-underline border rounded p-4 hover:bg-slate-50"
            >
              {cover && <img src={cover} className="rounded w-full h-40 object-cover mb-3" />}
              <h2 className="font-bold text-lg mb-1">{r.title}</h2>
              <p className="text-slate-600 text-sm">{r.summary || r.content.slice(0, 120)}</p>
              <div className="text-xs text-slate-500 mt-2">❤️ {r.likesCount} • 💬 {r.commentsCount}</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
