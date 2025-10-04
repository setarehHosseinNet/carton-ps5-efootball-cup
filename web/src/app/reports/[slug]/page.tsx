import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import LikeButton from "./like.client";
import CommentForm from "./comment.client";

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;                       // ← await
  const report = await prisma.report.findFirst({
    where: { slug: decodeURIComponent(slug) },
    include: {
      medias: { orderBy: { id: "asc" } },
      comments: { where: { approved: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!report) return notFound();

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
      {report.summary && <p className="text-slate-600 mb-4">{report.summary}</p>}

      {!!report.medias.length && (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 mb-8">
          {report.medias.map((m) =>
            m.type === "IMAGE"
              ? <img key={m.id} src={m.url} alt={report.title} className="rounded" />
              : <video key={m.id} src={m.url} controls className="rounded w-full" />
          )}
        </div>
      )}

      {report.content && (
        <article className="prose rtl max-w-none mb-8" dir="rtl"
          dangerouslySetInnerHTML={{ __html: report.content.replace(/\n/g, "<br/>") }} />
      )}

      <div className="flex items-center gap-4 mb-8">
        <LikeButton reportSlug={report.slug} initialCount={report.likesCount} />
        <span className="text-sm text-slate-500">💬 {report.commentsCount}</span>
      </div>

      <section>

// داخل src/app/reports/[slug]/page.tsx
<LikeButton reportSlug={report.slug} initialCount={report.likesCount} />
<CommentForm reportSlug={report.slug} />


        <h2 className="text-xl font-bold mb-3">نظرات</h2>
        <CommentForm reportSlug={report.slug} />
        <ul className="mt-6 space-y-3">
          {report.comments.map((c) => (
            <li key={c.id} className="border rounded p-3">
              <div className="text-xs text-slate-500 mb-1">
                {c.author || "بی‌نام"} — {new Intl.DateTimeFormat("fa-IR").format(c.createdAt)}
              </div>
              <div className="text-slate-700">{c.content}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
