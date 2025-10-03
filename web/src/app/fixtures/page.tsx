import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function FixturesPage() {
  const groups = await prisma.group.findMany({
    include: { matches: { include: { home: true, away: true }, orderBy: [{ week:"asc" }] } },
    orderBy: { name: "asc" }
  });

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">برنامهٔ بازی‌ها</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {groups.map(g => (
          <div key={g.id} className="bg-white rounded-2xl p-4 shadow-sm border">
            <h2 className="font-semibold mb-3">گروه {g.name}</h2>
            <ul className="space-y-2">
              {g.matches.map(m => (
                <li key={m.id} className="flex items-center justify-between border rounded-xl px-3 py-2">
                  <span className="text-xs bg-slate-100 rounded px-2 py-1">هفته {m.week ?? "-"}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{m.home.fullName}</span>
                    <span className="text-slate-400">×</span>
                    <span className="font-medium">{m.away.fullName}</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {m.gHome != null && m.gAway != null ? `${m.gHome} : ${m.gAway}` : "—"}
                  </span>
                </li>
              ))}
              {g.matches.length === 0 && <li className="text-slate-500">برنامه‌ای ثبت نشده.</li>}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
