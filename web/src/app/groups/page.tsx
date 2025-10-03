import { prisma } from "@/lib/db";
import { groupTable } from "@/lib/standings";
export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const groups = await prisma.group.findMany({ orderBy: { name: "asc" } });
  if (groups.length === 0) {
    return (
      <main>
        <h1 className="text-3xl font-bold mb-6">جدول گروه‌ها</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          هنوز گروهی ساخته نشده. از <a className="underline" href="/setup">صفحهٔ راه‌اندازی</a> شروع کن.
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">جدول گروه‌ها</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {await Promise.all(groups.map(async (g) => {
          const table = await groupTable(g.name);
          return (
            <div key={g.id} className="bg-white rounded-2xl p-4 shadow-sm border">
              <h2 className="font-semibold mb-3">گروه {g.name}</h2>
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="text-right p-2">بازیکن</th>
                    <th>P</th><th>W</th><th>D</th><th>L</th>
                    <th>GF</th><th>GA</th><th>GD</th><th>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {table?.map((r, i) => (
                    <tr key={r.playerId} className="border-t">
                      <td className={`p-2 ${i < 2 ? "font-semibold text-pink-600" : ""}`}>{r.name}</td>
                      <td className="text-center">{r.pld}</td>
                      <td className="text-center">{r.w}</td>
                      <td className="text-center">{r.d}</td>
                      <td className="text-center">{r.l}</td>
                      <td className="text-center">{r.gf}</td>
                      <td className="text-center">{r.ga}</td>
                      <td className="text-center">{r.gd}</td>
                      <td className="text-center font-bold">{r.pts}</td>
                    </tr>
                  ))}
                  {!table?.length && <tr><td colSpan={9} className="p-3 text-slate-500">جدولی برای این گروه وجود ندارد.</td></tr>}
                </tbody>
              </table>
            </div>
          );
        }))}
      </div>
    </main>
  );
}
