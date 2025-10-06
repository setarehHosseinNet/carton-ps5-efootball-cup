// web/src/app/admin/users/new/page.tsx
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import NewUserForm from "./NewUserForm.client";

// ✅ تایپ محلی برای کوئری‌استرینگ
type SearchParams = Record<string, string | string[] | undefined>;

const pickFirst = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

/** ✅ Next 15: searchParams باید Promise باشد */
export async function generateMetadata(
  { searchParams }: { searchParams?: Promise<SearchParams> }
): Promise<Metadata> {
  const sp = (await searchParams) ?? {};
  const ok = pickFirst(sp.ok);
  return { title: ok ? "Users – New (OK)" : "Users – New" };
}

/** ✅ Next 15: امضای صفحه با Promise */
export default async function NewUserPage(
  { searchParams }: { searchParams?: Promise<SearchParams> }
) {
  const me = await requireUser("/admin/users/new");
  if (me.role !== "admin") throw new Error("دسترسی ندارید.");

  const sp = (await searchParams) ?? {};
  const ok = pickFirst(sp.ok);
  const showSuccess =
    typeof ok === "string" && ["1", "true", "ok"].includes(ok.toLowerCase());

  return (
    <main className="container mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-bold">ساخت کاربر</h1>

      {showSuccess && (
        <div className="mb-4 rounded bg-emerald-50 px-3 py-2 text-emerald-700">
          کاربر ایجاد شد.
        </div>
      )}

      <NewUserForm />
    </main>
  );
}
