import { prisma } from "@/libs/prisma";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextResponse } from "next/server";

const getSum = (stats: any[], type: 'INCOME' | 'OUTCOME') =>
    Number(stats.find(s => s.type === type)?._sum.amount ?? 0);

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

        const now = new Date();
        const rangeCurrent = { gte: startOfMonth(now), lte: endOfMonth(now) };

        const [wallets, monthlyStats, ttlinvest, recentTransactions] = await Promise.all([
            prisma.wallet.aggregate({ _sum: { balance: true } }),
            prisma.transaction.groupBy({
                by: ['type'],
                where: { date: rangeCurrent },
                _sum: { amount: true }
            }),
            prisma.investment.aggregate({
                _sum: {
                    totalInvestment: true
                }
            }),
            prisma.transaction.findMany({
                take: 5,
                orderBy: { date: 'desc' },
                select: {
                    category: {
                        select: {
                            name: true,
                            color: true,
                            icon: true
                        }
                    },
                    investment: {
                        select: {
                            assetName: true,
                            provider: true,
                        }
                    },
                    amount: true,
                    toWallet: {
                        select: {
                            name: true,
                            type: true
                        }
                    },
                    date: true,
                    type: true,
                    description: true

                }
            }),
        ])

        const currentBalance = Number(wallets._sum.balance ?? 0);
        const currentInc = getSum(monthlyStats, 'INCOME');
        const currentOut = getSum(monthlyStats, 'OUTCOME');
        const totalInvest = Number(ttlinvest._sum.totalInvestment)

        return NextResponse.json({
            data: {
                totalBalance: currentBalance,
                monthlyIncome: currentInc,
                monthlyOutcome: currentOut,
                totalInvest: totalInvest,
                recentTransactions
            }
        })

    } catch (error) {
        console.error("error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process transaction"
        }, { status: 500 });
    }
}