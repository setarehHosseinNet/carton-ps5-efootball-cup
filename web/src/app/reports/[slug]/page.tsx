import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getSessionUser } from "@/lib/auth";
import { deleteReportBySlug } from "./actions"; // دقت کن این تابع را در actions.ts بسازیم (پایین گذاشتم)

// اگر این دو فایل را داری، ایمپورت بماند؛ نداریشان فعلاً کامنت کن
import LikeButton from "./like.client";
import CommentForm from "./comment.client";

export const dynamic = "force-dynamic";

type Params = { slug: string };

/** متادیتا برای SEO */
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = safeSlug(slug);
  if (!s) return { title: "گزارش" };

  const r = await prisma.report.findFirst({
    where: { slug: s },
    select: { title: true, summary: true },
  });

  return r
    ? { title: r.title, description: r.summary || undefined }
    : { title: "گزارش پیدا نشد" };
}

export default async function ReportPage({ params }: { params: Promise<Params> }) {
  // ⬅️ همه‌چیز داخل خود تابع صفحه (اسکوپ درخواست)
  const { slug } = await params;
  const s = safeSlug(slug);
  if (!s) notFound();

  const report = await prisma.report.findFirst({
    where: { slug: s },
    include: {
      medias: { orderBy: { id: "asc" } },
      comments: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, author: true, content: true, createdAt: true },
      },
    },
  });
  if (!report) notFound();

  // ⬅️ اینجا صدا بزن، نه بیرون فایل
  const user = await getSessionUser();
  const canEdit = !!user; // اگر خواستی محدود به نقش/مالک کن

  return (
    <main className="container mx-auto p-6" dir="rtl">
      {/* عنوان و خلاصه */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-1">{report.title}</h1>
        {!!report.summary && <p className="text-slate-600">{report.summary}</p>}
      </header>

      {/* دکمه‌های مدیریت فقط برای کسی که وارد شده */}
      {canEdit && (
        <div className="flex gap-2 mb-6">
          <a
            href={`/reports/${encodeURIComponent(report.slug)}/edit`}
            className="px-3 py-2 rounded border"
          >
            ویرایش
          </a>

          {/* حذف با server action */}
          <form action={async () => {
            "use server";
            await deleteReportBySlug(report.slug);
          }}>
            <button className="px-3 py-2 rounded bg-rose-600 text-white">
              حذف
            </button>
          </form>
        </div>
      )}

      {/* گالری مدیا */}
      {report.medias.length > 0 && (
        <section className="mb-8">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {report.medias.map((m) =>
              m.type === "IMAGE" ? (
                <Image
                  key={m.id}
                  src={m.url}
                  alt={report.title}
                  width={1200}
                  height={800}
                  className="rounded w-full h-auto"
                />
              ) : (
                <video key={m.id} src={m.url} controls className="rounded w-full" />
              )
            )}
          </div>
        </section>
      )}

      {/* متن گزارش */}
      {!!report.content && (
        <article className="prose prose-slate rtl max-w-none mb-8" dir="rtl">
          <div
            dangerouslySetInnerHTML={{
              __html: report.content.replace(/\n/g, "<br/>"),
            }}
          />
        </article>
      )}

      {/* لایک و شمارنده نظر */}
      <div className="flex items-center gap-4 mb-8">
        {/* اگر LikeButton را داری */}
        <LikeButton reportSlug={report.slug} initialCount={report.likesCount} />
        <span className="text-sm text-slate-500">💬 {report.commentsCount}</span>
      </div>

      {/* نظرات */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">نظرات</h2>

        {/* اگر CommentForm را داری */}
        <CommentForm reportSlug={report.slug} />

        <ul className="mt-6 space-y-3">
          {report.comments.length > 0 ? (
            report.comments.map((c) => (
              <li key={c.id} className="border rounded p-3">
                <div className="text-xs text-slate-500 mb-1">
                  {c.author || "بی‌نام"} —{" "}
                  {new Intl.DateTimeFormat("fa-IR").format(c.createdAt)}
                </div>
                <div className="text-slate-700">{c.content}</div>
              </li>
            ))
          ) : (
            <li className="text-slate-500">نظری ثبت نشده است.</li>
          )}
        </ul>
      </section>
    </main>
  );
}

/** decode/trim امن برای slug */
function safeSlug(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const s = decodeURIComponent(raw).trim();
    return s || null;
  } catch {
    return null;
  }
}
