import { prisma } from "@/libs/prisma";
import { getCache, setCache } from "@/libs/redis";
import { investDataDTO } from "@/server/dto/investDTO";
import { getInvestCacheKey } from "@/server/services/investService"
import { NextResponse } from "next/server";

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

        const cacheKey = getInvestCacheKey.data(user.userId)

        const cached = await getCache<investDataDTO[]>(cacheKey);

        if (cached) {
            return NextResponse.json({
                data: cached
            })
        }
        const data = await prisma.investment.findMany({
            where: {
                userId: user.userId
            },
            select: {
                id: true,
                assetName: true,
                provider: true,
                totalInvestment: true,
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