import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { deleteReportBySlug } from "./actions";
import Image from "next/image";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function ReportPage({
  params,
}: {
  params: Promise<Params>;
}) {
  // پارامتر را بگیر و مطمئن شو دیکد شده است
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);

  const commonInclude = {
    medias: { orderBy: { id: "asc" } },
    comments: {
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, author: true, content: true, createdAt: true },
    },
  } as const;

  // تلاش اول با slug دیکد‌شده
  let report = await prisma.report.findUnique({
    where: { slug },
    include: commonInclude,
  });

  // اگر پیدا نشد، یک بار هم با مقدار خام تلاش کن (برای سازگاری قدیمی)
  if (!report) {
    report = await prisma.report.findUnique({
      where: { slug: raw },
      include: commonInclude,
    });
  }

  if (!report) notFound();

  const user = await getSessionUser();
  const canEdit = !!user;

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
      {report.summary && <p className="text-slate-600 mb-6">{report.summary}</p>}

      {/* گالری مدیا */}
      {!!report.medias.length && (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 mb-8">
          {report.medias.map((m) =>
            m.type === "IMAGE" ? (
              <Image
                key={m.id}
                src={m.url}
                alt={report.title}
                width={1200}
                height={800}
                className="rounded"
              />
            ) : (
              <video key={m.id} src={m.url} controls className="rounded w-full" />
            )
          )}
        </div>
      )}

      {/* متن گزارش */}
      {report.content && (
        <article className="prose prose-slate max-w-none mb-8" dir="rtl">
          <div
            dangerouslySetInnerHTML={{
              __html: report.content.replace(/\n/g, "<br/>"),
            }}
          />
        </article>
      )}

      {/* فقط برای کاربر واردشده */}
      {canEdit && (
        <div className="flex gap-2 mb-8">
          <a
            href={`/reports/${encodeURIComponent(report.slug)}/edit`}
            className="px-3 py-2 rounded border"
          >
            ویرایش
          </a>

          <form action={deleteReportBySlug.bind(null, report.slug)}>
            <button className="px-3 py-2 rounded bg-rose-600 text-white">
              حذف
            </button>
          </form>
        </div>
      )}

      {/* این دو برای همه نمایش داده شود (مشاهده + ارسال) */}
      {/* اگر قبلاً به reportSlug مهاجرت داده‌ای، این دو خط را آنکامنت کن */}
      {/* 
      <div className="flex items-center gap-4 mb-8">
        <LikeButton reportSlug={report.slug} initialCount={report.likesCount} />
        <span className="text-sm text-slate-500">💬 {report.commentsCount}</span>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-3">نظرات</h2>
        <CommentForm reportSlug={report.slug} />
        <ul className="mt-6 space-y-3">
          {report.comments.map((c) => (
            <li key={c.id} className="border rounded p-3">
              <div className="text-xs text-slate-500 mb-1">
                {c.author || "بی‌نام"} —{" "}
                {new Intl.DateTimeFormat("fa-IR").format(c.createdAt)}
              </div>
              <div className="text-slate-700">{c.content}</div>
            </li>
          ))}
        </ul>
      </section>
      */}
    </main>
  );
}
