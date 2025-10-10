import { notFound } from "next/navigation";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReportPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const report = await prisma.report.findUnique({
    where: { slug },
    include: {
      medias: true,
      comments: { where: { approved: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!report) notFound();

  return (
    <main className="container mx-auto p-6">
      {/* ... UI گزارش ... */}
    </main>
  );
}
