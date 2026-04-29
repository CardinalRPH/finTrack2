import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { startOfMonth, endOfMonth, subDays, format, subMonths, eachDayOfInterval, isSameDay } from "date-fns";

export const dashboardService = {
    getData: async ({ ctx }: { ctx: Context }) => {
        try {
            const now = new Date();
            const rangeCurrent = { gte: startOfMonth(now), lte: endOfMonth(now) };
            const rangeLastMonth = { gte: startOfMonth(subMonths(now, 1)), lte: endOfMonth(subMonths(now, 1)) };
            const rangeOneYear = { gte: subDays(now, 365) }; // Untuk trend emas 1 tahun

            const thirtyDaysAgo = subDays(now, 30);
            const allDays = eachDayOfInterval({
                start: thirtyDaysAgo,
                end: now,
            });

            const [
                wallets, monthlyStats, investStat,
                recentTransactions, last30Days,
                lastMonthStats, prevInvestAgg, investYearlyTransactions,
                walletHistory, lastHistoryBefore
            ] = await Promise.all([
                ctx.prisma.wallet.aggregate({ _sum: { balance: true } }),
                ctx.prisma.transaction.groupBy({
                    by: ['type'],
                    where: { date: rangeCurrent },
                    _sum: { amount: true }
                }),
                ctx.prisma.transaction.aggregate({
                    where: { isInvestment: true },
                    _sum: { amount: true }
                }),
                ctx.prisma.transaction.findMany({
                    take: 5,
                    orderBy: { date: 'desc' },
                    include: { category: true }
                }),
                ctx.prisma.transaction.findMany({
                    where: { date: { gte: thirtyDaysAgo } },
                    orderBy: { date: 'asc' }
                }),
                ctx.prisma.transaction.groupBy({
                    by: ['type'],
                    where: { date: rangeLastMonth },
                    _sum: { amount: true }
                }),
                ctx.prisma.transaction.aggregate({
                    where: { isInvestment: true, date: { lt: rangeCurrent.gte } },
                    _sum: { amount: true }
                }),
                ctx.prisma.transaction.findMany({
                    where: { isInvestment: true, date: rangeOneYear },
                    orderBy: { date: 'asc' },
                    select: { date: true, amount: true }
                }),
                ctx.prisma.walletHistory.findMany({
                    where: { userId: ctx.user!.id, date: { gte: thirtyDaysAgo } },
                    orderBy: { date: 'asc' }
                }),
                ctx.prisma.walletHistory.findMany({
                    where: { userId: ctx.user!.id, date: { lt: thirtyDaysAgo } },
                    orderBy: { date: 'desc' },
                    distinct: ['walletId'] // Ambil saldo terakhir per wallet
                })
            ]);


            // --- Networth TREND ---
            const lastWalletBalances = new Map<string, number>();
            lastHistoryBefore.forEach((h) => {
                lastWalletBalances.set(h.walletId, Number(h.balance));
            });

            const netWorthData = allDays.map((day) => {
                const dailyChanges = walletHistory.filter((h) =>
                    isSameDay(new Date(h.date), day)
                );

                if (dailyChanges.length > 0) {
                    dailyChanges.forEach((change) => {
                        lastWalletBalances.set(change.walletId, Number(change.balance));
                    });
                }
                const totalDailyBalance = Array.from(lastWalletBalances.values()).reduce(
                    (sum, balance) => sum + balance,
                    0
                );

                return {
                    date: format(day, 'dd MMM'),
                    balance: totalDailyBalance,
                };
            });

            // Helpers
            const getSum = (stats: any[], type: 'INCOME' | 'OUTCOME') =>
                Number(stats.find(s => s.type === type)?._sum.amount ?? 0);

            const currentInc = getSum(monthlyStats, 'INCOME');
            const currentOut = getSum(monthlyStats, 'OUTCOME');
            const prevInc = getSum(lastMonthStats, 'INCOME');
            const prevOut = getSum(lastMonthStats, 'OUTCOME');

            const currentBalance = Number(wallets._sum.balance ?? 0);
            const currentInvest = Number(investStat._sum.amount ?? 0);
            const previousGold = Number(prevInvestAgg._sum.amount ?? 0);

            // --- CASHFLOW LOGIC ---
            const cashflowData = allDays.map((day) => {
                // Cari transaksi yang terjadi di hari yang sama
                const dailyTransactions = last30Days.filter((t) =>
                    isSameDay(new Date(t.date), day)
                );

                // Akumulasi Income & Expense untuk hari tersebut
                const income = dailyTransactions
                    .filter((t) => t.type === 'INCOME')
                    .reduce((sum, t) => sum + Number(t.amount), 0);

                const outcome = dailyTransactions
                    .filter((t) => t.type === 'OUTCOME')
                    .reduce((sum, t) => sum + Number(t.amount), 0);

                return {
                    date: format(day, 'dd MMM'), // Output: "29 Apr"
                    income,
                    outcome,
                };
            });
            // --- INVEST TREND ---
            const investTrendYearData = investYearlyTransactions.reduce((acc, curr) => {
                const dateLabel = curr.date.toLocaleString('default', {
                    month: 'short',
                    year: '2-digit'
                });

                // Cari apakah bulan ini sudah ada di accumulator
                const existing = acc.find(item => item.date === dateLabel);

                if (existing) {
                    existing.amount += Number(curr.amount);
                } else {
                    acc.push({ date: dateLabel, amount: Number(curr.amount) });
                }

                return acc;
            }, [] as { date: string, amount: number }[]);
            return {
                data: {
                    totalBalance: currentBalance,
                    monthlyIncome: currentInc,
                    monthlyOutcome: currentOut,
                    totalInvest: currentInvest,
                    recentTransactions,
                    trendData: {
                        cashFlow: cashflowData,
                        investYear: investTrendYearData,
                        netWorth: netWorthData
                    },
                    trendsSumary: {
                        totalBalance: calculateTrend(currentBalance, prevInc - prevOut),
                        totalInvest: calculateTrend(currentInvest, previousGold),
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

export type TrendChartData = {
    date: string;
    income: number;
    outcome: number;
    balance: number;
}

const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
};