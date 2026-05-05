import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { getStatisticSchemaType } from "../schemas/statisticSchema";
import { differenceInDays, eachDayOfInterval, eachMonthOfInterval, endOfDay, format, isSameDay, isSameMonth, sub } from "date-fns";
import { Decimal } from "../../../generated/prisma/internal/prismaNamespace";

export const statisticService = {
    getBalanceSts: async ({ ctx, input }: { ctx: Context, input: getStatisticSchemaType }) => {
        try {
            const { range } = input
            const now = new Date();
            let startDate: Date;

            if (range === '7D') {
                startDate = sub(now, { days: 7 });
            } else if (range === '30D') {
                startDate = sub(now, { days: 30 });
            } else if (range === '6M') {
                startDate = sub(now, { months: 6 });
            } else if (range === '1Y') {
                startDate = sub(now, { years: 1 });
            } else {
                startDate = sub(now, { days: 7 });
            }

            const dateFilter = {
                date: { gte: startDate, lte: endOfDay(now) }
            };

            const [wallet, topIncome, topOutcome, transactions] = await Promise.all([
                ctx.prisma.wallet.findMany({
                    where: {
                        userId: ctx.user!.id
                    },
                    select: {
                        balance: true,
                        name: true,
                        type: true,
                    }
                }),
                ctx.prisma.transaction.findFirst({
                    where: {
                        userId: ctx.user!.id,
                        ...dateFilter,
                        type: "INCOME"
                    },
                    orderBy: {
                        amount: "desc"
                    },
                    select: {
                        category: {
                            select: {
                                name: true
                            }
                        },
                        amount: true,
                    }
                }),
                ctx.prisma.transaction.findFirst({
                    where: {
                        userId: ctx.user!.id,
                        ...dateFilter,
                        type: "OUTCOME"
                    },
                    orderBy: {
                        amount: "desc"
                    },
                    select: {
                        category: {
                            select: {
                                name: true
                            }
                        },
                        amount: true,
                    }
                }),
                ctx.prisma.transaction.findMany({
                    where: {
                        ...dateFilter,
                        userId: ctx.user!.id
                    },
                    orderBy: { date: 'asc' },
                })

            ])

            const isLongTerm = range === '6M' || range === '1Y';

            const interval = isLongTerm
                ? eachMonthOfInterval({ start: startDate, end: now })
                : eachDayOfInterval({ start: startDate, end: now });

            const trendData = interval.map((point) => {
                const dailyTransactions = transactions.filter((t) => {
                    const tDate = new Date(t.date);
                    return isLongTerm
                        ? isSameMonth(tDate, point)
                        : isSameDay(tDate, point);
                });

                const income = dailyTransactions
                    .filter(t => t.type === 'INCOME')
                    .reduce((sum, t) => sum + Number(t.amount), 0);

                const outcome = dailyTransactions
                    .filter(t => t.type === 'OUTCOME')
                    .reduce((sum, t) => sum + Number(t.amount), 0);

                return {
                    label: format(point, isLongTerm ? 'MMM yy' : 'dd MMM'),
                    income,
                    outcome,
                    net: income - outcome,
                };
            });

            return {
                data: {
                    wallet,
                    aggregate: {
                        max_income: topIncome,
                        max_outcome: topOutcome
                    },
                    trendData

                }
            }
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error
            }
            console.error(error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal Server Error",
            })
        }
    },
    getCashflowSts: async ({ ctx, input }: { ctx: Context, input: getStatisticSchemaType }) => {
        try {
            const { range } = input
            const now = new Date();
            let startDate: Date;

            if (range === '7D') {
                startDate = sub(now, { days: 7 });
            } else if (range === '30D') {
                startDate = sub(now, { days: 30 });
            } else if (range === '6M') {
                startDate = sub(now, { months: 6 });
            } else if (range === '1Y') {
                startDate = sub(now, { years: 1 });
            } else {
                startDate = sub(now, { days: 7 });
            }

            const dateFilter = {
                date: { gte: startDate, lte: endOfDay(now) }
            };

            const [totalIncome, totalOutcome, IOWallet, transactions] = await Promise.all([
                ctx.prisma.transaction.aggregate({
                    where: {
                        userId: ctx.user!.id,
                        ...dateFilter,
                        type: "INCOME"
                    },
                    _sum: {
                        amount: true
                    }
                }),
                ctx.prisma.transaction.aggregate({
                    where: {
                        userId: ctx.user!.id,
                        ...dateFilter,
                        type: "OUTCOME"
                    },
                    _sum: {
                        amount: true
                    }
                }),
                ctx.prisma.wallet.findMany({
                    where: {
                        userId: ctx.user!.id,
                    },
                    orderBy: {
                        name: "asc"
                    },
                    select: {
                        name: true,
                        type: true,
                        transactions: {
                            where: dateFilter,
                            select: {
                                amount: true,
                                type: true,
                                isInvestment: true,
                            },
                            orderBy: {
                                date: "asc"
                            }
                        }
                    }
                }),
                ctx.prisma.transaction.findMany({
                    where: dateFilter,
                    orderBy: { date: 'asc' }
                }),
            ])
            const ttlIncome = totalIncome._sum.amount
            const ttlOutcome = totalOutcome._sum.amount
            const ttlNet = Number(ttlIncome) - Number(ttlOutcome)

            const isLongRange = range === '6M' || range === '1Y';
            const interval = isLongRange
                ? eachMonthOfInterval({ start: startDate, end: now })
                : eachDayOfInterval({ start: startDate, end: now });

            const chartData = interval.map((date) => {
                const groupTransactions = transactions.filter((t) =>
                    isLongRange ? isSameMonth(t.date, date) : isSameDay(t.date, date)
                );

                const income = groupTransactions
                    .filter(t => t.type === 'INCOME')
                    .reduce((sum, t) => sum + Number(t.amount), 0);

                const outcome = groupTransactions
                    .filter(t => t.type === 'OUTCOME')
                    .reduce((sum, t) => sum + Number(t.amount), 0);

                return {
                    date: format(date, isLongRange ? 'MMM yy' : 'dd MMM'),
                    income,
                    outcome,
                    net: income - outcome
                };
            });

            const ioWalletData = IOWallet.map(({ name, type, transactions }) => {
                const stats = transactions.reduce((acc, item) => {
                    const amount = Number(item.amount);
                    if (item.type === "INCOME") acc.income += amount;
                    if (item.type === "OUTCOME") acc.outcome += amount;
                    return acc;
                }, { income: 0, outcome: 0 });

                return {
                    name,
                    type,
                    income: stats.income,
                    outcome: stats.outcome,
                    networth: stats.income - stats.outcome
                };
            });

            return {
                data: {
                    totalIncome: ttlIncome,
                    totalOutcome: ttlOutcome,
                    totalNetworth: ttlNet,
                    walletData: ioWalletData,
                    chartData
                }
            }

        } catch (error) {
            if (error instanceof TRPCError) {
                throw error
            }
            console.error(error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal Server Error",
            })
        }
    },
    getSpending: async ({ ctx, input }: { ctx: Context, input: getStatisticSchemaType }) => {
        try {
            const { range } = input;
            const now = new Date();
            let startDate: Date;

            if (range === '7D') {
                startDate = sub(now, { days: 7 });
            } else if (range === '30D') {
                startDate = sub(now, { days: 30 });
            } else if (range === '6M') {
                startDate = sub(now, { months: 6 });
            } else if (range === '1Y') {
                startDate = sub(now, { years: 1 });
            } else {
                startDate = sub(now, { days: 7 });
            }

            const dateFilter = {
                userId: ctx.user!.id,
                date: { gte: startDate, lte: endOfDay(now) }
            };

            const [walletStatsRaw, categoryStatsRaw, wallets, categories] = await Promise.all([
                ctx.prisma.transaction.groupBy({
                    by: ['walletId', 'type'],
                    where: dateFilter,
                    _sum: { amount: true },
                }),
                ctx.prisma.transaction.groupBy({
                    by: ['categoryId', 'type'],
                    where: dateFilter,
                    _sum: { amount: true },
                }),
                ctx.prisma.wallet.findMany({
                    where: { userId: ctx.user!.id },
                    select: { id: true, name: true }
                }),
                ctx.prisma.category.findMany({
                    where: { userId: ctx.user!.id },
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

            return {
                data: {
                    byWallet: {
                        topExpense: getTopFive(walletMapped, 'OUTCOME'),
                        topIncome: getTopFive(walletMapped, 'INCOME'),
                    },
                    byCategory: {
                        topExpense: getTopFive(categoryMapped, 'OUTCOME'),
                        topIncome: getTopFive(categoryMapped, 'INCOME'),
                    }
                }
            };

        } catch (error) {
            if (error instanceof TRPCError) {
                throw error
            }
            console.error(error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal Server Error",
            })
        }
    },
    getReport: async ({ ctx, input }: { ctx: Context, input: getStatisticSchemaType }) => {
        try {
            const { range } = input;
            const now = new Date();
            let startDate: Date;

            if (range === '7D') {
                startDate = sub(now, { days: 7 });
            } else if (range === '30D') {
                startDate = sub(now, { days: 30 });
            } else if (range === '6M') {
                startDate = sub(now, { months: 6 });
            } else if (range === '1Y') {
                startDate = sub(now, { years: 1 });
            } else {
                startDate = sub(now, { days: 7 });
            }

            const dateFilter = {
                userId: ctx.user!.id,
                date: { gte: startDate, lte: endOfDay(now) }
            };

            const [statsRaw, walletStatsRaw, categoryStatsRaw, wallets, categories] = await Promise.all([
                ctx.prisma.transaction.groupBy({
                    by: ['type'],
                    where: dateFilter,
                    _sum: { amount: true },
                    _count: { _all: true }
                }),
                ctx.prisma.transaction.groupBy({
                    by: ['walletId', 'type'],
                    where: dateFilter,
                    _sum: { amount: true },
                }),
                ctx.prisma.transaction.groupBy({
                    by: ['categoryId', 'type'],
                    where: dateFilter,
                    _sum: { amount: true },
                }),
                ctx.prisma.wallet.findMany({ where: { userId: ctx.user!.id }, select: { id: true, name: true } }),
                ctx.prisma.category.findMany({ where: { userId: ctx.user!.id }, select: { id: true, name: true } })
            ]);

            const daysDiff = Math.max(differenceInDays(now, startDate), 1);

            const getGlobalStat = (type: 'INCOME' | 'OUTCOME') => {
                const data = statsRaw.find(s => s.type === type);
                const totalAmount = Number(data?._sum?.amount ?? 0);
                const count = data?._count?._all ?? 0;
                return {
                    count,
                    totalAmount,
                    averagePerDay: totalAmount / daysDiff,
                    averagePerRecord: count > 0 ? totalAmount / count : 0
                };
            };

            const incomeMetrics = getGlobalStat('INCOME');
            const expenseMetrics = getGlobalStat('OUTCOME');

            const transformToInOut = <T extends ResourceItem>(
                stats: StatResult[],
                sourceList: T[],
                idKey: string
            ): InOutReport[] => {
                return sourceList
                    .map((item) => {
                        // Mencari data INCOME untuk item ini
                        const inStat = stats.find(
                            (s) => s[idKey] === item.id && s.type === "INCOME"
                        );

                        // Mencari data OUTCOME untuk item ini
                        const outStat = stats.find(
                            (s) => s[idKey] === item.id && s.type === "OUTCOME"
                        );

                        return {
                            name: item.name,
                            // Mengonversi Decimal Prisma ke number JavaScript standar
                            in: Number(inStat?._sum?.amount ?? 0),
                            out: Number(outStat?._sum?.amount ?? 0),
                        };
                    })
                    // Hanya mengembalikan data yang memiliki aktivitas keuangan
                    .filter((item) => item.in > 0 || item.out > 0);
            };

            const reportByWallet = transformToInOut(
                walletStatsRaw as unknown as StatResult[],
                wallets,
                'walletId'
            );

            const reportByCategory = transformToInOut(
                categoryStatsRaw as unknown as StatResult[],
                categories,
                'categoryId'
            );

            return {
                data: {
                    metrics: {
                        income: incomeMetrics,
                        expenses: expenseMetrics,
                        netCashFlow: incomeMetrics.totalAmount - expenseMetrics.totalAmount
                    },
                    byWallet: reportByWallet,
                    byCategory: reportByCategory
                }
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error
            }
            console.error(error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal Server Error",
            })
        }
    }
}

interface BaseSource {
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
}

interface PrismaStat {
    type: "INCOME" | "OUTCOME" | string;
    _sum: {
        amount: any;
    };
    [key: string]: any;
}

interface MappedResult {
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
    type: 'INCOME' | 'OUTCOME';
    amount: number;
}


// Interface untuk item referensi (Wallet atau Category)
interface ResourceItem {
    id: string;
    name: string;
}

// Interface untuk data statistik dari Prisma
interface StatResult {
    type: string;
    _sum: {
        amount: Decimal | number | null;
    };
    [key: string]: any; // Mengizinkan akses dinamis ke walletId atau categoryId
}

// Interface untuk hasil transformasi
interface InOutReport {
    name: string;
    in: number;
    out: number;
}