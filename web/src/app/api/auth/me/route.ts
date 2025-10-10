// src/app/api/auth/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Session = {
  id: number;
  username: string;
  role: "admin" | "user";
  // هر فیلد دیگری که در سشن ذخیره می‌کنی...
};

export async function GET() {
  // ✅ در Next 15 باید await کنیم (در Edge هم ok است)
  const jar = await cookies();

  // هر دو نام محتمل کوکی را چک کن
  const raw = jar.get("sess")?.value ?? jar.get("session")?.value;
  if (!raw) {
    return NextResponse.json({ ok: false, user: null });
  }

  try {
    const session = JSON.parse(raw) as Partial<Session>;
    if (!session || !session.username) {
      return NextResponse.json({ ok: false, user: null });
    }
    return NextResponse.json({ ok: true, user: session });
  } catch {
    return NextResponse.json({ ok: false, user: null });
  }
}
