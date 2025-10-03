import { cookies, headers } from "next/headers";
import { randomUUID, createHash } from "crypto";

export function getFingerprint(): string {
  const c = cookies();
  let fp = c.get("fp")?.value;
  if (!fp) {
    fp = randomUUID();
    c.set("fp", fp, { httpOnly: true, sameSite: "lax", maxAge: 60*60*24*365 });
  }
  const ip = headers().get("x-forwarded-for") || "0.0.0.0";
  return createHash("sha256").update(ip + "::" + fp).digest("hex");
}
