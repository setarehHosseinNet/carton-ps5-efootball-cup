import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { updateMatchById, deleteMatchById } from "./actions";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import JalaliDateTime from "@/components/JalaliDateTime.client";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function EditMatchPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const matchId = Number(id);
  if (!Number.isFinite(matchId)) notFound();

  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/matches/${encodeURIComponent(matchId)}/edit`);

  const [match, groups, players] = await Promise.all([
    prisma.match.findUnique({
      where: { id: matchId },
      include: { group: true, home: true, away: true },
    }),
    prisma.group.findMany({ orderBy: { id: "asc" } }),
    prisma.player.findMany({ orderBy: { fullName: "asc" } }),
  ]);

  if (!match) notFound();

  const kickoffLocal = match.kickoffAt
    ? toLocalDatetimeValue(match.kickoffAt)
    : "";

  return (
    <main dir="rtl" className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ویرایش بازی #{matchId}</h1>

      {/* فرم ویرایش */}
      <form action={updateMatchById.bind(null, matchId)} className="space-y-4 max-w-2xl">
        {/* گروه */}
        <div>
          <label className="block mb-1 font-medium">گروه</label>
          <select
            name="groupId"
            defaultValue={String(match.groupId)}
            className="w-full rounded border p-2"
          >
            {groups.map((g) => (
              <option key={g.id} value={String(g.id)}>
                {g.name || `Group ${g.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* میزبان / میهمان */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">میزبان</label>
            <select
              name="homeId"
              defaultValue={String(match.homeId)}
              className="w-full rounded border p-2"
            >
              {players.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">میهمان</label>
            <select
              name="awayId"
              defaultValue={String(match.awayId)}
              className="w-full rounded border p-2"
            >
              {players.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* هفته / گل‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">هفته</label>
            <input
              type="number"
              name="week"
              defaultValue={match.week ?? undefined}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">گل میزبان</label>
            <input
              type="number"
              name="homeScore"
              defaultValue={match.homeScore ?? undefined}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">گل میهمان</label>
            <input
              type="number"
              name="awayScore"
              defaultValue={match.awayScore ?? undefined}
              className="w-full rounded border p-2"
            />
          </div>
        </div>

        {/* زمان و وضعیت */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
      
  <label className="block mb-1 font-medium">زمان شروع</label>
  <JalaliDateTime
    name="kickoffAt"
    defaultValueISO={match.kickoffAt ? match.kickoffAt.toISOString() : undefined}
    className="w-full rounded border p-2"
  />
</div>

          <div>
            <label className="block mb-1 font-medium">وضعیت</label>
            <select
              name="status"
              defaultValue={match.status}
              className="w-full rounded border p-2"
            >
              <option value="SCHEDULED">در برنامه</option>
              <option value="DONE">انجام‌شده</option>
            </select>
          </div>
        </div>

        <button className="px-4 py-2 rounded bg-black text-white">
          ذخیره تغییرات
        </button>
      </form>

      {/* حذف بازی: دکمهٔ کلاینتی داخل فرم Server Action */}
      <form action={deleteMatchById.bind(null, matchId)} className="max-w-2xl mt-6">
        <ConfirmDeleteButton
          className="px-4 py-2 rounded bg-rose-600 text-white"
          label="حذف بازی"
          message="از حذف بازی مطمئن هستید؟"
        />
      </form>
    </main>
  );
}

/** yyyy-MM-ddTHH:mm برای ورودی datetime-local */
function toLocalDatetimeValue(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
