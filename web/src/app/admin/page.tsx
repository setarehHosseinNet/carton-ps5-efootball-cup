// web/src/app/admin/page.tsx
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MatchStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // لیست بازی‌های برنامه‌ریزی‌شده
  const matches = await prisma.match.findMany({
    where: { status: MatchStatus.SCHEDULED },   // ✅ enum
    include: { home: true, away: true, group: true },
    orderBy: [{ week: "asc" }, { id: "asc" }],
  });

  // ✅ Server Action: فقط FormData می‌گیرد و Promise<void> برمی‌گرداند
  async function submitResult(formData: FormData): Promise<void> {
    "use server";

    const matchId = Number(formData.get("matchId"));
    const home = Math.trunc(Number(formData.get("gHome")));
    const away = Math.trunc(Number(formData.get("gAway")));
    if (!Number.isFinite(matchId) || !Number.isFinite(home) || !Number.isFinite(away)) {
      return; // می‌تونی اینجا redirect یا setCookie هم انجام بدی
    }

    try {
      await prisma.match.update({
        where: { id: matchId },
        data: {
          homeScore: home,            // ✅ مطابق schema.prisma
          awayScore: away,            // ✅
          status: MatchStatus.DONE,   // ✅
        },
      });
    } finally {
      // صفحات مرتبط را تازه کن
      revalidatePath("/admin");
      revalidatePath("/groups");
    }
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ثبت نتیجه مسابقات</h1>

      {matches.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          بازی برنامه‌ریزی‌شده‌ای باقی نمانده. اگر هنوز برنامه‌ای ساخته نشده،
          از <a href="/setup" className="underline">صفحهٔ راه‌اندازی</a> «Generate Fixtures» را بزنید.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {matches.map((m) => (
            <div key={m.id} className="bg-white border rounded-2xl p-4 shadow-sm">
              <div className="text-sm text-slate-500 mb-2">
                گروه {m.group?.name ?? "—"} • هفته {m.week ?? "—"}
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">{m.home.fullName}</div>
                <span className="text-slate-400">vs</span>
                <div className="font-medium">{m.away.fullName}</div>
              </div>

              {/* ✅ اکشن تک‌آرگومانی */}
              <form action={submitResult} className="flex items-center gap-3">
                <input type="hidden" name="matchId" value={m.id} />

                <input
                  name="gHome"
                  type="number"
                  min="0"
                  className="w-16 h-10 text-center border rounded-lg"
                  placeholder="میزبان"
                  required
                />
                <span className="text-slate-400">:</span>
                <input
                  name="gAway"
                  type="number"
                  min="0"
                  className="w-16 h-10 text-center border rounded-lg"
                  placeholder="میهمان"
                  required
                />

                <button className="ml-auto px-4 py-2 rounded-xl bg-black text-white">
                  ثبت
                </button>
              </form>

              <div className="mt-2 text-xs text-slate-500">
                نتیجه فعلی: {m.homeScore} - {m.awayScore}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
