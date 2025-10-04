import prisma from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      medias: { take: 1, orderBy: { id: "asc" } },
    },
  });

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">تابلو اعلانات</h1>

      <div className="grid gap-4">
        {items.map((r) => {
          const cover = r.medias[0]?.url ?? "";
          return (
            <Link
              key={r.id}
              href={`/reports/${encodeURIComponent(r.slug)}`}
              className="block border rounded p-4 no-underline hover:bg-slate-50"
            >
              <h2 className="text-lg font-bold mb-2">{r.title}</h2>
              {cover ? (
                // از <img> ساده استفاده می‌کنیم تا مشکل domain نداشته باشیم
                <img src={cover} alt={r.title} className="w-full rounded mb-3" />
              ) : null}
              <p className="text-slate-600">{r.summary}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
