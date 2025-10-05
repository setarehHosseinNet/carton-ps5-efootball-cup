// src/app/fixtures/page.tsx
import prisma from "@/lib/db";               // ✅ default import
import { faDateTime } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function FixturesPage() {
  const groups = await prisma.group.findMany({
    orderBy: { id: "asc" },
    include: {
      matches: {
        orderBy: [{ week: "asc" }, { kickoffAt: "asc" }, { id: "asc" }],
        select: {
          id: true,
          week: true,
          kickoffAt: true,
          homeScore: true,                  // ✅ نام درست فیلدها
          awayScore: true,                  // ✅ نام درست فیلدها
          home: { select: { id: true, fullName: true } },
          away: { select: { id: true, fullName: true } },
        },
      },
    },
  });

  return (
    <main dir="rtl" className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">برنامهٔ بازی‌ها</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {groups.map((g) => (
          <div key={g.id} className="bg-white rounded-2xl p-4 shadow-sm border">
            <h2 className="font-semibold mb-3">گروه {g.name ?? g.id}</h2>

            <ul className="space-y-2">
              {g.matches.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between border rounded-xl px-3 py-2"
                >
                  {/* هفته */}
                  <span className="text-xs bg-slate-100 rounded px-2 py-1">
                    هفته {m.week ?? "—"}
                  </span>

                  {/* اسامی تیم‌ها */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{m.home.fullName}</span>
                    <span className="text-slate-400">×</span>
                    <span className="font-medium">{m.away.fullName}</span>
                  </div>

                  {/* تاریخ شمسی + نتیجه */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      🗓️ {faDateTime(m.kickoffAt)}
                    </span>
                    <span className="text-sm font-semibold">
                      {m.homeScore != null && m.awayScore != null
                        ? `${m.homeScore} : ${m.awayScore}`
                        : "—"}
                    </span>
                  </div>
                </li>
              ))}

              {g.matches.length === 0 && (
                <li className="text-slate-500">برنامه‌ای ثبت نشده.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
