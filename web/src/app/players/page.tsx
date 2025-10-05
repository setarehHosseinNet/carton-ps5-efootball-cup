import prisma from "@/lib/db";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const [items, user] = await Promise.all([
    prisma.player.findMany({
      orderBy: [{ groupId: "asc" }, { id: "asc" }],
      include: { group: true },
    }),
    getSessionUser(),
  ]);
  const canEdit = Boolean(user);

  return (
    <main dir="rtl" className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">بازیکن‌ها</h1>

      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded border p-3"
          >
            <div>
              <div className="font-medium">{p.fullName}</div>
              <div className="text-xs text-slate-500">
                گروه: {p.group?.name ?? p.groupId}
                {p.dept ? ` • دپارتمان: ${p.dept}` : null}
              </div>
            </div>

            {canEdit && (
              <Link
                href={`/players/${p.id}/edit`}
                className="px-3 py-1.5 rounded bg-slate-900 text-white"
              >
                ویرایش
              </Link>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
