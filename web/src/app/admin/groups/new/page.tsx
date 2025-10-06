import { createGroupAction } from "./actions";
import { requireUser } from "@/lib/auth";

export default async function NewGroupPage() {
  await requireUser("/admin/groups/new");

  return (
    <main className="container mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-bold mb-6">ساخت گروه</h1>
      <form action={createGroupAction} className="space-y-4">
        <div>
          <label className="block mb-1">نام گروه</label>
          <input name="name" required className="w-full border rounded p-2" />
        </div>
        <button className="px-4 py-2 rounded bg-indigo-600 text-white">ایجاد</button>
      </form>
    </main>
  );
}
