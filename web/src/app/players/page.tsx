import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    orderBy: [{ groupId: "asc" }, { fullName: "asc" }],
    select: { id: true, fullName: true, dept: true, groupId: true },
  });

  return (
    <main className="container mx-auto p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">بازیکنان</h1>
      <ul className="space-y-2">
        {players.map(p => (
          <li key={p.id} className="border rounded p-3">
            <div className="font-bold">{p.fullName}</div>
            <div className="text-sm text-slate-600">
              شماره: {p.fullName ?? "-"} • گروه: {p.groupId ?? "-"} • دپارتمان: {p.dept ?? "-"}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
