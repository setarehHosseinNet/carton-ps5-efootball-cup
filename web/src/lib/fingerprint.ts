import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export function getFingerprint(): string {
  const jar = cookies();
  let fp = jar.get("fp")?.value;
  if (!fp) {
    fp = randomUUID();
    jar.set("fp", fp, { httpOnly: true, sameSite: "lax", maxAge: 60*60*24*365, path: "/" });
  }
  return fp;
}
