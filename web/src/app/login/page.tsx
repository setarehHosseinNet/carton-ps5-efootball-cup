// web/src/app/login/page.tsx
import { loginAction } from "./actions"; // امضایش: (fd: FormData) => Promise<{ok:boolean; error?:string}>
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  // ✅ Server Action تک‌آرگومانی که Promise<void> برمی‌گرداند
  async function submit(fd: FormData): Promise<void> {
    "use server";

    const res = await loginAction(fd); // نتیجه را عمداً برنمی‌گردانیم
    // اگر خواستی بعد از موفقیت ریدایرکت هم بکنی:
    if (res?.ok) {
      const next = (fd.get("next") as string) || "/";
      redirect(next);
    }
    // در صورت خطا هم می‌تونی لاگ/کوکی/ریدایرکت بزنی
  }

  return (
    <main className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">ورود</h1>

      {/* ✅ اکنون action امضای درست دارد */}
      <form action={submit} className="space-y-3">
        <div>
          <label className="block mb-1">نام‌کاربری</label>
          <input name="username" className="w-full border rounded p-2" required />
        </div>

        <div>
          <label className="block mb-1">رمز</label>
          <input name="password" type="password" className="w-full border rounded p-2" required />
        </div>

        {/* مسیر مقصد پس از ورود */}
        <input type="hidden" name="next" value="/" />

        <button className="w-full rounded bg-indigo-600 text-white py-2">ورود</button>
      </form>
    </main>
  );
}
