// src/lib/fingerprint.ts
import { cookies, headers } from "next/headers";
import { randomUUID, createHash } from "crypto";

/** فقط می‌خوانَد و هش اثرانگشت را برمی‌گرداند (بدون set کردن کوکی) */
export async function getFingerprint(): Promise<string> {
  const jar = await cookies();     // ✅ async در Next 15
  const hdr = await headers();     // ✅ async در Next 15

  const fp = jar.get("fp")?.value ?? "anon";
  const ip = hdr.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";

  return createHash("sha256").update(`${ip}::${fp}`).digest("hex");
}

/** اگر کوکی نبود، می‌سازد؛ فقط در Server Action یا Route Handler صدا بزن */
export async function ensureFingerprint(): Promise<string> {
  "use server";

  const jar = await cookies();
  const hdr = await headers();

  let fp = jar.get("fp")?.value;
  if (!fp) {
    fp = randomUUID();
    jar.set("fp", fp, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 سال
    });
  }

  const ip = hdr.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
  return createHash("sha256").update(`${ip}::${fp}`).digest("hex");
}
