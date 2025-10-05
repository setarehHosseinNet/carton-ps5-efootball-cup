import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { updateMatch } from "../../actions";
import { requireAdmin } from "@/lib/auth";
import dayjs from "dayjs";

type Params = { id: string };
export const dynamic = "force-dynamic";

export default async function EditMatchPage({ params }: { params: Promise<Params> }) {
  await requireAdmin();

  const { id } = await params;
  const mid = Number(id);
  if (!Number.isFinite(mid)) notFound();

  const m = await prisma.match.findUnique({
    where: { id: mid },
    select: {
      id: true,
      kickoffAt: true,
      homeScore: true,
      awayScore: true,
      home: { select: { fullName: true } },
      away: { select: { fullName: true } },
    },
  });
  if (!m) notFound();

  // مقداردهی اولیه input type="datetime-local"
  const kickoffDefault = m.kickoffAt ? dayjs(m.kickoffAt).format("YYYY-MM-DDTHH:mm") : "";

  return (
    <main className="container mx-auto p-6" dir="rtl">
      <h1 className="text-xl font-bold mb-6">
        ویرایش بازی: {m.home?.fullName ?? "?"} - {m.away?.fullName ?? "?"}
      </h1>

      <form action={async (fd) => updateMatch(mid, fd)} className="space-y-4 max-w-md">
        <label className="block">
          <div className="mb-1">زمان برگزاری</div>
          <input
            name="kickoff"
            type="datetime-local"
            defaultValue={kickoffDefault}
            className="w-full border rounded p-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="mb-1">گل‌های میزبان</div>
            <input
              name="homeScore"
              type="number"
              defaultValue={m.homeScore ?? ""}
              className="w-full border rounded p-2"
            />
          </label>
          <label className="block">
            <div className="mb-1">گل‌های میهمان</div>
            <input
              name="awayScore"
              type="number"
              defaultValue={m.awayScore ?? ""}
              className="w-full border rounded p-2"
            />
          </label>
        </div>

        <button className="px-4 py-2 rounded bg-blue-600 text-white">ذخیره</button>
      </form>
    </main>
  );
}
