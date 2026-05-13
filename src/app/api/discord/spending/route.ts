import { prisma } from "@/libs/prisma";
import { getCache, setCache } from "@/libs/redis";
import { BaseSource, MappedResult, PrismaStat, stsSpendingDTO } from "@/server/dto/statisticDTO";
import { getStsCacheKey } from "@/server/services/statisticService";
import { endOfDay, sub } from "date-fns";
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

        const cacheKey = getStsCacheKey("spending", user.userId, "30D");

        const cachedData = await getCache<stsSpendingDTO>(cacheKey);
        if (cachedData) {
            return { data: cachedData };
        }
        const now = new Date();

        const dateFilter = {
            userId: user.userId,
            date: { gte: sub(now, { days: 30 }), lte: endOfDay(now) }
        };

        const [walletStatsRaw, categoryStatsRaw, wallets, categories] = await Promise.all([
            prisma.transaction.groupBy({
                by: ['walletId', 'type'],
                where: dateFilter,
                _sum: { amount: true },
            }),
            prisma.transaction.groupBy({
                by: ['categoryId', 'type'],
                where: dateFilter,
                _sum: { amount: true },
            }),
            prisma.wallet.findMany({
                where: { userId: user.userId },
                select: { id: true, name: true }
            }),
            prisma.category.findMany({
                where: { userId: user.userId },
                select: { id: true, name: true, icon: true, color: true }
            })
        ]);

        const mapData = <T extends BaseSource>(
            stats: PrismaStat[],
            sourceList: T[],
            idKey: string
        ): MappedResult[] => {
            return stats
                .filter(s => s.type === 'INCOME' || s.type === 'OUTCOME')
                .map((stat) => {
                    const id = stat[idKey] as string;
                    const detail = sourceList.find((s) => s.id === id);

                    return {
                        id,
                        name: detail?.name ?? 'Unknown',
                        color: detail?.color ?? null,
                        icon: detail?.icon ?? null,
                        type: stat.type as "INCOME" | "OUTCOME",
                        amount: Number(stat._sum.amount ?? 0),
                    };
                });
        };

        const walletMapped = mapData(walletStatsRaw as PrismaStat[], wallets, 'walletId');
        const categoryMapped = mapData(categoryStatsRaw as PrismaStat[], categories, 'categoryId');

        const getTopFive = (data: MappedResult[], type: "INCOME" | "OUTCOME") => {
            return data
                .filter(item => item.type === type)
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5);
        };

        const result = {
            byWallet: {
                topExpense: getTopFive(walletMapped, 'OUTCOME'),
                topIncome: getTopFive(walletMapped, 'INCOME'),
            },
            byCategory: {
                topExpense: getTopFive(categoryMapped, 'OUTCOME'),
                topIncome: getTopFive(categoryMapped, 'INCOME'),
            }
        }

        setCache(cacheKey, JSON.stringify(result))

        return NextResponse.json({
            data: result
        })

    } catch (error) {
        console.error("error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process transaction"
        }, { status: 500 });
    }
}