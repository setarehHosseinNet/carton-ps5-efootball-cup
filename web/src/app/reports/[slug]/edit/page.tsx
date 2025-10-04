import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { updateReportAction } from "../actions";

type Params = { slug: string };

export default async function EditReport({
  params,
}: { params: Promise<Params> }) {
  const { slug } = await params;
  await requireUser(`/reports/${slug}/edit`);

  const report = await prisma.report.findUnique({
    where: { slug },
    select: { slug: true, title: true, summary: true, content: true },
  });
  if (!report) notFound();

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ویرایش گزارش</h1>

      <form action={updateReportAction} className="space-y-3 max-w-3xl">
        <input type="hidden" name="slug" value={report.slug} />
        <input
          name="title"
          defaultValue={report.title ?? ""}
          placeholder="عنوان"
          className="w-full border rounded p-2"
          required
        />
        <input
          name="summary"
          defaultValue={report.summary ?? ""}
          placeholder="خلاصه"
          className="w-full border rounded p-2"
        />
        <textarea
          name="content"
          defaultValue={report.content ?? ""}
          placeholder="متن"
          className="w-full border rounded p-2"
          rows={10}
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-black text-white">ذخیره</button>
          <a className="px-4 py-2 rounded border" href={`/reports/${report.slug}`}>انصراف</a>
        </div>
      </form>
    </main>
  );
}
