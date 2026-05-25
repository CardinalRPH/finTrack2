import { prisma } from "@/libs/prisma";
import { getCache, setCache } from "@/libs/redis";
import { walletDTO } from "@/server/dto/walletDTO";
import { NextResponse } from "next/server";

const getWaletCacheKey = (userId: string) => `wallet:${userId}`;
export const GET = async (req: Request) => {
    try {
        const discordId = req.headers.get("x-discord-id");

        const user = await prisma.account.findFirst({
            where: {
                providerAccountId: discordId as string
            },
            select: {
                userId: true
            }
        })

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "User not connected to app"
            }, { status: 403 });
        }

        const cacheKey = getWaletCacheKey(user.userId)

        const cached = await getCache<walletDTO[]>(cacheKey);

        if (cached) {
            return NextResponse.json({
                data: cached
            })
        }

        const data = await prisma.wallet.findMany({
            where: {
                userId: user.userId
            },
            orderBy: {
                name: "asc"
            },
            select: {
                id: true,
                name: true,
                type: true,
                balance: true
            }
        })

        await setCache(cacheKey, JSON.stringify(data));

        return NextResponse.json({
            data
        })

    } catch (error) {
        console.error("error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process transaction"
        }, { status: 500 });
    }
}