import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { updatePlayer, deletePlayer } from "../../actions";
import { requireAdmin } from "@/lib/auth";

type Params = { id: string };

export const dynamic = "force-dynamic";

export default async function EditPlayerPage({ params }: { params: Promise<Params> }) {
  await requireAdmin(); // امن

  const { id } = await params;
  const pid = Number(id);
  if (!Number.isFinite(pid)) notFound();

  const player = await prisma.player.findUnique({
    where: { id: pid },
    select: { id: true, fullName: true },
  });
  if (!player) notFound();

  return (
    <main className="container mx-auto p-6" dir="rtl">
      <h1 className="text-xl font-bold mb-4">ویرایش بازیکن</h1>

      <form action={async (fd) => updatePlayer(pid, fd)} className="space-y-4 max-w-md">
        <input name="name" className="w-full border rounded p-2" defaultValue={player.fullName} />
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-blue-600 text-white">ذخیره</button>
        </div>
      </form>

      <hr className="my-6" />

      <form
        action={async () => {
          "use server";
          await deletePlayer(pid);
        }}
      >
        <button className="px-4 py-2 rounded bg-rose-600 text-white">حذف بازیکن</button>
      </form>
    </main>
  );
}
