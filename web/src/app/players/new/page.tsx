import { createPlayer } from "../actions";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewPlayerPage() {
  await requireAdmin("/players/new");

  return (
    <main className="container mx-auto p-6" dir="rtl">
      <h1 className="text-xl font-bold mb-4">بازیکن جدید</h1>
      <form action={createPlayer} className="space-y-4 max-w-md">
        <input name="name" className="w-full border rounded p-2" placeholder="نام" />
        <button className="px-4 py-2 rounded bg-emerald-600 text-white">ثبت</button>
      </form>
    </main>
  );
}
