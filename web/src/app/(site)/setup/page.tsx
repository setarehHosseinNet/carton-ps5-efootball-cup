export default function SetupPage() {
  const Card = ({ title, desc, action, href }: any) => (
    <form method="post" action={href} className="bg-white rounded-2xl shadow-sm p-6 border">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{desc}</p>
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 transition"
      >
        {action}
      </button>
    </form>
  );

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">راه‌اندازی سریع مسابقات</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          title="۱) ساخت گروه‌ها و بازیکن‌ها"
          desc="لیست اولیه از پوستر وارد می‌شود. بعداً می‌توانید ویرایش کنید."
          action="Seed دمو"
          href="/setup/seed"
        />
        <Card
          title="۲) تولید برنامهٔ بازی‌ها"
          desc="Round-Robin برای هر گروه (هر تیم یک‌بار با بقیه)."
          action="Generate Fixtures"
          href="/setup/generate"
        />
        <Card
          title="پاک‌سازی کامل"
          desc="حذف تمام گروه‌ها، بازیکن‌ها و بازی‌ها."
          action="Wipe All"
          href="/setup/wipe"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href="/admin" className="px-4 py-2 rounded-xl bg-pink-600 text-white">ثبت نتایج</a>
        <a href="/fixtures" className="px-4 py-2 rounded-xl bg-slate-800 text-white">برنامه بازی‌ها</a>
        <a href="/groups" className="px-4 py-2 rounded-xl bg-slate-200">جدول گروه‌ها</a>
      </div>
    </main>
  );
}
