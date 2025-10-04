import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * این اندپوینت نقش کاربر را از کوکی می‌خواند.
 * اگر شما قبلاً کوکی دیگری می‌گذارید، اینجا مطابقش تغییر بده:
 * - "sess" حاوی JSON { name, role }
 * - یا کوکی ساده "role"
 */
export async function GET() {
  const jar = cookies();

  let role = "guest";
  let name = "کاربر";

  const sessRaw = jar.get("sess")?.value || jar.get("session")?.value;
  if (sessRaw) {
    try {
      const s = JSON.parse(sessRaw);
      role = s?.role || role;
      name = s?.name || name;
    } catch { /* ignore */ }
  } else {
    role = jar.get("role")?.value || role;
  }

  if (role === "guest") {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: { name, role } });
}
