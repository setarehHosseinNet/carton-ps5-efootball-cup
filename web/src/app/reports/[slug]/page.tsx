// src/app/reports/[slug]/page.tsx
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";

// کلاینت‌ها (از همین دایرکتوری)
import LikeButton from "./like.client";
import CommentForm from "./comment.client";

export const dynamic = "force-dynamic" as const;

type Params = { slug: string };

/** کمک‌تابع: decode/trim امن برای slug */
function safeSlug(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const s = decodeURIComponent(raw).trim();
    return s || null;
  } catch {
    return null;
  }
}

/** متادیتا بر اساس گزارش — مفید برای SEO */
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
  // ⚠️ در Next.js 15، params باید await شود
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

  const likesCount = report.likesCount ?? 0;
  const commentsCount = report.commentsCount ?? report.comments.length;

  return (
    <main className="container mx-auto p-6" dir="rtl">
      {/* عنوان و خلاصه */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-1">{report.title}</h1>
        {report.summary ? (
          <p className="text-slate-600">{report.summary}</p>
        ) : null}
      </header>

      {/* گالری مدیا */}
      {report.medias.length > 0 && (
        <section className="mb-8">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {report.medias.map((m, i) =>
              m.type === "IMAGE" ? (
                <Image
                  key={m.id}
                  src={m.url}
                  alt={report.title}
                  width={1200}
                  height={800}
                  className="rounded w-full h-auto"
                  priority={i === 0}
                  // اگر عکس‌ها از دامین خارجی می‌آیند و در next.config دامنه ثبت نشده،
                  // می‌توانید موقتاً از این استفاده کنید:
                  // unoptimized
                />
              ) : (
                <video
                  key={m.id}
                  src={m.url}
                  controls
                  className="rounded w-full"
                />
              )
            )}
          </div>
        </section>
      )}

      {/* متن گزارش */}
      {report.content && (
        <article className="prose prose-slate rtl max-w-none mb-8" dir="rtl">
          <div
            // اگر محتوای شما HTML خام است، بهتر است sanitize کنید.
            // در حالت متن ساده، این تبدیل newline به <br/> کفایت می‌کند.
            dangerouslySetInnerHTML={{
              __html: report.content.replace(/\n/g, "<br/>"),
            }}
          />
        </article>
      )}

      {/* اکشن‌ها: لایک + شمارنده نظر */}
      <div className="flex items-center gap-4 mb-8">
        <LikeButton reportSlug={report.slug} initialCount={likesCount} />
        <span className="text-sm text-slate-500">💬 {commentsCount}</span>
      </div>

      {/* نظرات + فرم ارسال */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">نظرات</h2>

        {/* فرم ارسال نظر */}
        <CommentForm reportSlug={report.slug} />

        {/* لیست نظرات تأیید شده */}
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
