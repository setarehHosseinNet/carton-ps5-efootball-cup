// src/app/logout/route.ts
import { NextResponse } from "next/server";
import { COOKIE, destroySession } from "@/lib/auth";

async function doLogout(req: Request) {
    await destroySession(); // فقط DB
    const res = NextResponse.redirect(new URL("/login", req.url));
    // حذف کوکی در response (اینجا مجازه)
    res.cookies.set({
        name: COOKIE,
        value: "",
        path: "/",
        expires: new Date(0),
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    return res;
}

export async function GET(request: Request) { return doLogout(request); }
export async function POST(request: Request) { return doLogout(request); }
