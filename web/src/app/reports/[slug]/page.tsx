import prisma from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "./like.client";
import CommentForm from "./comment.client";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const safeSlug = decodeURIComponent(slug);

  const report = await prisma.report.findFirst({
    where: { slug: safeSlug },
    include: {
      medias: true,
      comments: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, author: true, content: true, createdAt: true },
      },
    },
  });

  if (!report) {
    // برای دیباگ: در ترمینال dev نشان می‌دهد
    console.warn("report 404 for slug:", safeSlug);
    notFound();
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
      {report.summary && <p className="text-slate-600 mb-4">{report.summary}</p>}

      {!!report.medias.length && (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 mb-8">
          {report.medias.map((m) =>
            m.type === "IMAGE" ? (
              <Image key={m.id} src={m.url} alt={report.title} width={1200} height={800} className="rounded" />
            ) : (
              <video key={m.id} src={m.url} controls className="rounded w-full" />
            )
          )}
        </div>
      )}

      {report.content && (
        <article className="prose prose-slate rtl max-w-none mb-8" dir="rtl">
          <div dangerouslySetInnerHTML={{ __html: report.content.replace(/\n/g, "<br/>") }} />
        </article>
      )}

      <div className="flex items-center gap-4 mb-8">
        <LikeButton slug={report.slug} initialCount={report.likesCount} />
        <span className="text-sm text-slate-500">💬 {report.commentsCount}</span>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-3">نظرات</h2>
        <CommentForm slug={report.slug} />
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
