// src/app/reports/[slug]/page.tsx
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// اگر این فایل‌ها را داری، فعال بمانند:
import LikeButton from "./like.client";
import CommentForm from "./comment.client";

import { getSessionUser } from "@/lib/auth";
import { deleteReportBySlug } from "./actions";

export const dynamic = "force-dynamic";

type Params = { slug: string };

// (اختیاری) عنوان/توضیح صفحه از دیتابیس
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = decodeURIComponent(slug);
  const r = await prisma.report.findFirst({
    where: { slug: s },
    select: { title: true, summary: true },
  });
  return {
    title: r?.title ?? "گزارش پیدا نشد",
    description: r?.summary ?? undefined,
  };
}

export default async function ReportPage({ params }: { params: Promise<Params> }) {
  // ✅ در Next.js 15 باید قبل از استفاده، params را await کنیم
  const { slug } = await params;
  const s = decodeURIComponent(slug); // مهم: جلوگیری از 404 برای اسلاگ‌های فارسی

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

  const user = await getSessionUser();
  const canEdit = Boolean(user);

  return (
    <main className="container mx-auto p-6" dir="rtl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
        {report.summary ? (
          <p className="text-slate-600">{report.summary}</p>
        ) : null}
      </header>

      {/* دکمه‌های مخصوص کاربر واردشده */}
      {canEdit && (
        <div className="flex gap-2 mb-8">
          <Link
            className="px-3 py-2 rounded border"
            href={`/reports/${encodeURIComponent(report.slug)}/edit`}
          >
            ویرایش
          </Link>

          {/* حذف با Server Action */}
          <form action={deleteReportBySlug.bind(null, report.slug)}>
            <button className="px-3 py-2 rounded bg-rose-600 text-white">
              حذف
            </button>
          </form>
        </div>
      )}

      {/* گالری مدیا */}
      {!!report.medias.length && (
        <section className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-8">
          {report.medias.map((m) =>
            m.type === "IMAGE" ? (
              <Image
                key={m.id}
                src={m.url} // مسیرهایی مثل /uploads/2025-10-03/xxx.jpg
                alt={report.title}
                width={1200}
                height={800}
                className="rounded w-full h-auto"
              />
            ) : (
              <video key={m.id} src={m.url} controls className="rounded w-full" />
            )
          )}
        </section>
      )}

      {/* متن گزارش (در صورت HTML، newline به <br> تبدیل شود) */}
      {report.content && (
        <article className="prose prose-slate rtl max-w-none mb-10" dir="rtl">
          <div
            dangerouslySetInnerHTML={{
              __html: report.content.replace(/\n/g, "<br/>"),
            }}
          />
        </article>
      )}

      {/* اکشن‌های عمومی: لایک و نظرات */}
      <section className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          {/* اگر LikeButton داری */}
          <LikeButton reportSlug={report.slug} initialCount={report.likesCount} />
          <span className="text-sm text-slate-500">💬 {report.commentsCount}</span>
        </div>

        {/* اگر CommentForm داری */}
        <CommentForm reportSlug={report.slug} />

        {/* لیست نظرات تأییدشده */}
        <ul className="mt-6 space-y-3">
          {report.comments.map((c) => (
            <li key={c.id} className="border rounded p-3">
              <div className="text-xs text-slate-500 mb-1">
                {c.author || "بی‌نام"} —{" "}
                {new Intl.DateTimeFormat("fa-IR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(c.createdAt)}
              </div>
              <div className="text-slate-700 whitespace-pre-wrap">{c.content}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
