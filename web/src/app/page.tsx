import { prisma } from "@/lib/db";

export default async function Home() {
  const groups = await prisma.group.count();
  const matches = await prisma.match.count();
  const done = await prisma.match.count({ where: { status: "DONE" } });

  return (
    <div className="space-y-8">
      {/* هرو */}
      <section className="rounded-3xl bg-white border shadow-sm p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          مسابقات <span className="text-pink-600">eFootball</span> – کارتن محمد
        </h1>
        <p className="text-slate-600 mb-6">
          ثبت نتایج، جدول گروه‌ها، و برنامهٔ مسابقات با رابط کاربری فارسی/RTL.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/setup" className="px-5 py-2.5 rounded-2xl bg-black text-white no-underline">شروع سریع</a>
          <a href="/admin" className="px-5 py-2.5 rounded-2xl bg-pink-600 text-white no-underline">ثبت نتایج</a>
          <a href="/groups" className="px-5 py-2.5 rounded-2xl bg-slate-200 no-underline">مشاهده جدول‌ها</a>
        </div>
      </section>

      {/* آمار کوتاه */}
      <section className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border p-4 text-center">
          <div className="text-3xl font-extrabold">{groups}</div>
          <div className="text-slate-600 text-sm mt-1">گروه</div>
        </div>
        <div className="rounded-2xl bg-white border p-4 text-center">
          <div className="text-3xl font-extrabold">{matches}</div>
          <div className="text-slate-600 text-sm mt-1">کل بازی‌ها</div>
        </div>
        <div className="rounded-2xl bg-white border p-4 text-center">
          <div className="text-3xl font-extrabold">{done}</div>
          <div className="text-slate-600 text-sm mt-1">بازی‌های ثبت‌شده</div>
        </div>
      </section>
    </div>
  );
}
