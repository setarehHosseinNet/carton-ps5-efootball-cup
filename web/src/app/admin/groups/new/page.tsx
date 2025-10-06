// web/src/app/admin/groups/new/page.tsx
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function NewGroupPage() {
  // فقط ادمین‌ها اجازهٔ دسترسی داشته باشند (یا هر سیاستی که داری)
  await requireUser("/admin/groups/new");

  // ✅ Server Action با امضای صحیح (فقط FormData)
  async function createGroup(formData: FormData) {
    "use server";

    const name = (formData.get("name") as string | null)?.trim() ?? "";
    if (!name) return; // یا می‌تونی خطا برگردونی/Redirect کنی

    await prisma.group.create({ data: { name } });

    // صفحات/لیست‌ها را تازه کن
    revalidatePath("/admin/groups");
    revalidatePath("/groups");
  }

  return (
    <main className="container mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-bold mb-6">ساخت گروه</h1>

      {/* ✅ action اکنون یک تابع تک‌آرگومانی است */}
      <form action={createGroup} className="space-y-4">
        <div>
          <label className="block mb-1">نام گروه</label>
          <input name="name" required className="w-full border rounded p-2" />
        </div>

        <button className="px-4 py-2 rounded bg-indigo-600 text-white">
          ایجاد
        </button>
      </form>
    </main>
  );
}
