import prisma from "@/lib/db";
import Link from "next/link";
import { getCurrentUserIsAdmin } from "@/lib/auth";
import { formatJ } from "@/lib/jdate";

export const dynamic = "force-dynamic";

export default async function MatchesListPage() {
  const isAdmin = await getCurrentUserIsAdmin();

  const games = await prisma.match.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      kickoffAt: true,         // ← اگر نام فیلدتان چیز دیگری است، همینجا عوض کن
      homeScore: true,
      awayScore: true,
      home: { select: { fullName: true } }, // ← اگر relation دارید
      away: { select: { fullName: true } },
    },
  });

  return (
    <main className="container mx-auto p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">بازی‌ها</h1>

      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-right">#</th>
              <th className="p-2 text-right">میزبان</th>
              <th className="p-2 text-right">میهمان</th>
              <th className="p-2 text-right">زمان (شمسی)</th>
              <th className="p-2 text-right">نتیجه</th>
              {isAdmin && <th className="p-2"></th>}
            </tr>
          </thead>
          <tbody>
            {games.map((g) => (
              <tr key={g.id} className="border-t">
                <td className="p-2">{g.id}</td>
                <td className="p-2">{g.home?.fullName ?? "?"}</td>
                <td className="p-2">{g.away?.fullName ?? "?"}</td>
                <td className="p-2">{g.kickoffAt ? formatJ(g.kickoffAt) : "-"}</td>
                <td className="p-2">
                  {g.homeScore ?? "-"} : {g.awayScore ?? "-"}
                </td>
                {isAdmin && (
                  <td className="p-2">
                    <Link className="px-2 py-1 rounded border" href={`/matches/${g.id}/edit`}>
                      ویرایش
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
