import { prisma } from "@/lib/db";
export default async function Home() {
  const groups = await prisma.group.findMany();
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">مسابقات eFootball – کارتن محمد</h1>
      <div className="text-slate-600">تعداد گروه‌ها: {groups.length}</div>
    </main>
  );
}
