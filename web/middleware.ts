import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",                // صفحه اصلی که به /reports ریدایرکت می‌کنید
  "/login",
  "/reports",
  "/groups",
  "/api/reports"      // APIهای لایک/کامنت عمومی بمانند
];

function isPublic(pathname: string) {
  return (
    PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // اجازه برای public assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  // عمومی‌ها:
  if (isPublic(pathname)) return NextResponse.next();

  // نیاز به ورود:
  const sid = req.cookies.get("sid")?.value;
  if (!sid) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // وجود کوکی کافی نیست، ولی در edge به DB وصل نمی‌شیم؛
  // تأیید نهایی در سرور انجام می‌شود. اینجا فقط جریان را می‌بندیم.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next|favicon.ico).*)"]
};