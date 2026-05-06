// src/middleware.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const { pathname } = req.nextUrl

    // 1. If user is logged in and tries to access the landing page, send to dashboard
    if (pathname === "/" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // 2. If user is NOT logged in and tries to access dashboard, send to landing
    if (pathname !== "/" && !token) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
}