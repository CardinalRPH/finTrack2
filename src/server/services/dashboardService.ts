import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { startOfMonth, endOfMonth, subDays, format, subMonths } from "date-fns";
import { EntryType } from "../../../generated/prisma/enums";
import { Decimal } from "../../../generated/prisma/internal/prismaNamespace";

export const dashboardService = {
    getData: async ({ ctx }: { ctx: Context }) => {
        try {
            const now = new Date();
            const rangeCurrent = { gte: startOfMonth(now), lte: endOfMonth(now) };
            const rangeLastMonth = { gte: startOfMonth(subMonths(now, 1)), lte: endOfMonth(subMonths(now, 1)) };
            const rangeOneYear = { gte: subDays(now, 365) }; // Untuk trend emas 1 tahun

            const [
                wallets, monthlyStats, goldStats,
                recentTransactions, last30Days,
                lastMonthStats, prevGoldAgg, goldYearlyTransactions
            ] = await Promise.all([
                ctx.prisma.wallet.aggregate({ _sum: { balance: true } }),
                ctx.prisma.transaction.groupBy({
                    by: ['type'],
                    where: { date: rangeCurrent },
                    _sum: { amount: true }
                }),
                ctx.prisma.transaction.aggregate({
                    where: { isInvestment: true },
                    _sum: { gramAmount: true }
                }),
                ctx.prisma.transaction.findMany({
                    take: 5,
                    orderBy: { date: 'desc' },
                    include: { category: true }
                }),
                ctx.prisma.transaction.findMany({
                    where: { date: { gte: subDays(now, 30) } },
                    orderBy: { date: 'asc' }
                }),
                ctx.prisma.transaction.groupBy({
                    by: ['type'],
                    where: { date: rangeLastMonth },
                    _sum: { amount: true }
                }),
                ctx.prisma.transaction.aggregate({
                    where: { isInvestment: true, date: { lt: rangeCurrent.gte } },
                    _sum: { gramAmount: true }
                }),
                ctx.prisma.transaction.findMany({
                    where: { isInvestment: true, date: rangeOneYear },
                    orderBy: { date: 'asc' },
                    select: { date: true, gramAmount: true }
                })
            ]);

            // Helpers
            const getSum = (stats: any[], type: 'INCOME' | 'OUTCOME') =>
                Number(stats.find(s => s.type === type)?._sum.amount ?? 0);

            const currentInc = getSum(monthlyStats, 'INCOME');
            const currentOut = getSum(monthlyStats, 'OUTCOME');
            const prevInc = getSum(lastMonthStats, 'INCOME');
            const prevOut = getSum(lastMonthStats, 'OUTCOME');

            const currentBalance = Number(wallets._sum.balance ?? 0);
            const currentGold = Number(goldStats._sum.gramAmount ?? 0);
            const previousGold = Number(prevGoldAgg._sum.gramAmount ?? 0);

            return {
                data: {
                    totalBalance: currentBalance,
                    monthlyIncome: currentInc,
                    monthlyOutcome: currentOut,
                    totalGold: currentGold,
                    recentTransactions,
                    trendData: processTrendData(last30Days),
                    goldTrendYearly: goldYearlyTransactions.map(t => ({
                        date: format(t.date, 'MMM yy'),
                        gram: Number(t.gramAmount ?? 0)
                    })),
                    trendsSumary: {
                        totalBalance: calculateTrend(currentBalance, prevInc - prevOut),
                        totalGold: calculateTrend(currentGold, previousGold),
                        monthlyIncome: calculateTrend(currentInc, prevInc),
                        monthlyOutcome: calculateTrend(currentOut, prevOut),
                    }
                }
            };
        } catch (error) {
            if (error instanceof TRPCError) throw error;
            console.error(error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch dashboard data",
            });
        }
    }
};

type processTrendDataType = {
    date: Date;
    id: string;
    createdAt: Date;
    description: string | null;
    type: EntryType;
    userId: string;
    walletId: string;
    amount: Decimal;
    categoryId: string | null;
    toWalletId: string | null;
    isInvestment: boolean;
    gramAmount: Decimal | null;
    buyPrice: Decimal | null;
    sellPrice: Decimal | null;
}

export type TrendChartData = {
    date: string;
    income: number;
    outcome: number;
    balance: number;
}

function processTrendData(transactions: processTrendDataType[]) {
    const chartMap = new Map<string, TrendChartData>();

    transactions.forEach(tx => {
        const day = format(tx.date, 'd MMM');
        const current = chartMap.get(day) || { date: day, income: 0, outcome: 0, balance: 0 };

        if (tx.type === 'INCOME') current.income += Number(tx.amount);
        if (tx.type === 'OUTCOME') current.outcome += Number(tx.amount);

        chartMap.set(day, current);
    });

    return Array.from(chartMap.values());
}

const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
};