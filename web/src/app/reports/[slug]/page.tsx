import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import LikeButton from "./like.client";
import CommentForm from "./comment.client";

export default async function ReportPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);

  const report = await prisma.report.findUnique({
    where: { slug },
    include: {
      medias: { orderBy: { id: "asc" } },
      comments: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!report) return notFound();

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
      <p className="text-slate-600 mb-4">{report.summary}</p>

      <article
        className="prose rtl prose-slate mb-6"
        dangerouslySetInnerHTML={{ __html: report.content.replace(/\n/g, "<br/>") }}
      />

      <div className="grid gap-3 mb-8">
        {report.medias.map((m) =>
          m.type === "IMAGE" ? (
            <img key={m.id} src={m.url} alt="" className="rounded" />
          ) : (
            <video key={m.id} src={m.url} className="rounded" controls />
          )
        )}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <LikeButton reportId={report.id} initialCount={report.likesCount} />
        <span className="text-slate-500 text-sm">💬 {report.commentsCount}</span>
      </div>

      <h2 className="text-xl font-bold mb-3">نظرات</h2>
      <CommentForm reportId={report.id} />

      <ul className="mt-4 space-y-3">
        {report.comments.map((c) => (
          <li key={c.id} className="border rounded p-3">
            <div className="text-sm text-slate-500 mb-1">{c.author || "بی‌نام"}</div>
            <div>{c.content}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
