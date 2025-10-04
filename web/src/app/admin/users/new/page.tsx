import { createUserAction } from "./actions";
import { requireUser } from "@/lib/auth";

export default async function NewUserPage({ searchParams }: { searchParams: { ok?: string }}) {
  const me = await requireUser("/admin/users/new");
  if (me.role !== "admin") throw new Error("دسترسی ندارید.");

  return (
    <main className="container mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-bold mb-6">ساخت کاربر</h1>
      {searchParams.ok && <div className="mb-4 text-green-700">کاربر ایجاد شد.</div>}
      <form action={createUserAction} className="space-y-4">
        <div>
          <label className="block mb-1">نام کاربری</label>
          <input name="username" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">رمز عبور</label>
          <input name="password" type="password" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">نقش</label>
          <select name="role" className="w-full border rounded p-2">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button className="px-4 py-2 rounded bg-emerald-600 text-white">ایجاد</button>
      </form>
    </main>
  );
}
