import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { updatePlayerById, deletePlayerById } from "../actions";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const playerId = Number(id);
  if (!Number.isFinite(playerId)) notFound();

  // فقط ادمین/کاربر واردشده حق ویرایش دارد
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/players/${playerId}/edit`);

  const [player, groups] = await Promise.all([
    prisma.player.findUnique({ where: { id: playerId } }),
    prisma.group.findMany({ orderBy: { id: "asc" } }),
  ]);

  if (!player) notFound();

  return (
    <main dir="rtl" className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ویرایش بازیکن</h1>

      {/* فرم باید در Server Component باشد */}
      <form
        action={updatePlayerById.bind(null, playerId)}
        className="max-w-xl space-y-4"
      >
        <div>
          <label className="block text-sm mb-1">نام و نام خانوادگی</label>
          <input
            name="fullName"
            defaultValue={player.fullName}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">دپارتمان (اختیاری)</label>
          <input
            name="dept"
            defaultValue={player.dept ?? ""}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">گروه</label>
          <select
            name="groupId"
            defaultValue={String(player.groupId)}
            className="w-full rounded border p-2"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name ?? `گروه ${g.id}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded bg-black text-white px-4 py-2"
          >
            ذخیره
          </button>

          {/* حذف باید در فرم جدا باشد، داخل همون Server Component */}
          <form action={deletePlayerById.bind(null, playerId)}>
            <button
              type="submit"
              className="rounded bg-rose-600 text-white px-4 py-2"
            >
              حذف
            </button>
          </form>
        </div>
      </form>
    </main>
  );
}
