"use client";

import { useState } from "react";

export default function UploadField() {
  const [pending, setPending] = useState(false);
  const [url, setUrl] = useState<string>("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file); // اسم باید دقیقا "file" باشد

    setPending(true);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setPending(false);

    if (!res.ok) {
      alert("آپلود انجام نشد");
      return;
    }
    const data = await res.json();
    setUrl(data.url);
  }

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*,video/*" onChange={onChange} />
      {pending && <div className="text-sm">در حال آپلود…</div>}
      {url && <div className="text-xs">فایل آپلود شد: <code>{url}</code></div>}
      {/* این فیلد همراه فرم اصلی ارسال می‌شود */}
      <input type="hidden" name="mediaUrl" value={url} />
    </div>
  );
}
