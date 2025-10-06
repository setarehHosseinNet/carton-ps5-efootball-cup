"use client";

import { useMemo, useState } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

type Props = {
  name: string;               // نام فیلدی که Server Action می‌خواند (مثلاً kickoffAt)
  defaultValueISO?: string;   // مقدار اولیه به صورت ISO (مثلاً از دیتابیس)
  className?: string;
};

export default function JalaliDateTime({ name, defaultValueISO, className }: Props) {
  // مقدار اولیه اگر هست به Date تبدیل می‌کنیم
  const initial = useMemo(
    () => (defaultValueISO ? new Date(defaultValueISO) : null),
    [defaultValueISO]
  );

  const [value, setValue] = useState<any>(initial);

  // تبدیل به ISO برای ارسال به سرور (Server Action)
  const iso = useMemo(() => {
    try {
      // value ممکن است Date یا DateObject باشد
      const d: Date =
        value?.toDate?.() instanceof Date
          ? value.toDate()
          : value instanceof Date
          ? value
          : null;

      return d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString() : "";
    } catch {
      return "";
    }
  }, [value]);

  return (
    <>
      <DatePicker
        value={value}
        onChange={setValue}
        calendar={persian}
        locale={persian_fa}
        format="YYYY/MM/DD HH:mm"
        plugins={[<TimePicker key="t" />]}
        calendarPosition="bottom-right"
        inputClass={className || "w-full rounded border p-2"}
        editable={false}
        placeholder="تاریخ/ساعت را انتخاب کنید"
      />
      {/* این فیلد مخفی به Server Action ارسال می‌شود */}
      <input type="hidden" name={name} value={iso} readOnly />
    </>
  );
}
