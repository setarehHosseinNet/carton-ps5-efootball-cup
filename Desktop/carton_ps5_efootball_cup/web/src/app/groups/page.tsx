import { prisma } from "@/lib/db";
import { groupTable } from "@/lib/standings";

export const dynamic = "force-dynamic";

export default async function GroupsPage(){
  const groups = await prisma.group.findMany({ orderBy:{ name:"asc" }});
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">جدول گروه‌ها</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {await Promise.all(groups.map(async g => {
          const table = await groupTable(g.name);
          return (
            <div key={g.id} className="bg-white rounded-2xl shadow p-4">
              <h2 className="font-semibold mb-3">گروه {g.name}</h2>
              <table className="w-full text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="text-right p-2">بازیکن</th>
                    <th>P</th><th>W</th><th>D</th><th>L</th>
                    <th>GF</th><th>GA</th><th>GD</th><th>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {table?.map(r=>(
                    <tr key={r.playerId} className="border-t">
                      <td className="p-2">{r.name}</td>
                      <td className="text-center">{r.pld}</td>
                      <td className="text-center">{r.w}</td>
                      <td className="text-center">{r.d}</td>
                      <td className="text-center">{r.l}</td>
                      <td className="text-center">{r.gf}</td>
                      <td className="text-center">{r.ga}</td>
                      <td className="text-center">{r.gd}</td>
                      <td className="text-center font-semibold">{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }))}
      </div>
    </main>
  );
}