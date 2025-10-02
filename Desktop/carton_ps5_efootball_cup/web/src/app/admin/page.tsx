import { prisma } from "@/lib/db";
import { saveResult } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const matches = await prisma.match.findMany({
    where:{ status:"SCHEDULED" },
    include:{ home:true, away:true, group:true },
    orderBy:[{ week:"asc" }, { id:"asc" }]
  });

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ثبت نتیجه مسابقات</h1>
      {matches.length === 0 && <p>بازی برنامه‌ریزی‌شده‌ای باقی نمانده.</p>}
      <ul className="space-y-3">
        {matches.map(m => (
          <li key={m.id} className="bg-white shadow rounded-2xl p-4">
            <div className="mb-2 font-medium">
              گروه {m.group.name} — هفته {m.week ?? "-"} — {m.home.fullName} vs {m.away.fullName}
            </div>
            <form action={saveResult} className="flex items-center gap-2">
              <input type="hidden" name="matchId" value={m.id} />
              <input name="gHome" type="number" min="0" className="border rounded p-2 w-16 text-center" placeholder="گل میزبان" required />
              <span>:</span>
              <input name="gAway" type="number" min="0" className="border rounded p-2 w-16 text-center" placeholder="گل میهمان" required />
              <button className="rounded-xl px-4 py-2 bg-black text-white">ثبت</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}