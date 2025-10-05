// src/app/reports/new/page.tsx
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import NewReportForm from "./NewReportForm.client";

export const dynamic = "force-dynamic"; // تا cookies داخل Request Context باشد

export default async function NewReportPage() {
  // فقط کاربر واردشده اجازه دسترسی دارد
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/reports/new")}`);
  }

  return (
    <main dir="rtl" className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ایجاد گزارش جدید</h1>
      {/* فرم کاملاً کلاینتی */}
      <NewReportForm />
    </main>
  );
}
