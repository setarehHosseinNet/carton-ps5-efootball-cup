// قالب‌بندی تاریخ به شمسی (جلالی) + fallback
export function faDateTime(input?: Date | string | null, withTime = true) {
  if (!input) return "—";

  const date = typeof input === "string" ? new Date(input) : input;
  const options: Intl.DateTimeFormatOptions = withTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" };

  try {
    // جلالی با اعداد فارسی
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", options).format(date);
  } catch {
    // fallback اگر محیط intl از تقویم persian پشتیبانی نداشت
    return new Intl.DateTimeFormat("fa-IR", options).format(date);
  }
}
