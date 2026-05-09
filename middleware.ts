// src/middleware.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import processEnv from "./env"

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    if (pathname.startsWith("/api/discord")) {
        {
            const apiKey = req.headers.get("x-api-key")
            const discordId = req.headers.get("x-discord-id")
            const secretKey = processEnv.DISCORD_BOT_SECRET

            if (!apiKey || apiKey !== secretKey) {
                return new NextResponse(
                    JSON.stringify({ success: false, message: "Invalid API Key" }),
                    { status: 401, headers: { "content-type": "application/json" } }
                )
            }

            if (!discordId) {
                return new NextResponse(
                    JSON.stringify({ success: false, message: "Missing Discord User ID" }),
                    { status: 400, headers: { "content-type": "application/json" } }
                )
            }

            return NextResponse.next()
        }
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (pathname === "/" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (pathname !== "/" && !token) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/api/discord/:path*", "/((?!_next/static|_next/image|favicon.ico|images).*)"],
}