import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// هم GET و هم POST را ساپورت کن تا <Link> یا <form> هردو کار کنند
export async function GET(req: Request) {
  await destroySession();
  return NextResponse.redirect(new URL("/", req.url));
}
export async function POST(req: Request) {
  return GET(req);
}
