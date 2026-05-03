import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { geStatisticSchemaType } from "../schemas/statisticSchema";
import { eachDayOfInterval, eachMonthOfInterval, endOfDay, format, isSameDay, isSameMonth, sub } from "date-fns";

export const statisticService = {
    getBalanceSts: async ({ ctx, input }: { ctx: Context, input: geStatisticSchemaType }) => {
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
                startDate = sub(now, { days: 7 }); // Default
            }

            const dateFilter = {
                date: { gte: startDate, lte: endOfDay(now) }
            };

            const [wallet, aggregate, transactions] = await Promise.all([
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
                ctx.prisma.transaction.aggregate({
                    _max: {
                        amount: true
                    },
                    _min: {
                        amount: true
                    },
                    where: {
                        userId: ctx.user!.id,
                        ...dateFilter
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

            // 4. Mapping data untuk grafik
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
                    // Label: "12 May" jika harian, "May 26" jika bulanan
                    label: format(point, isLongTerm ? 'MMM yy' : 'dd MMM'),
                    income,
                    outcome,
                    // Net Trend: Selisih masuk dan keluar
                    net: income - outcome,
                };
            });

            return {
                data: {
                    wallet,
                    aggregate: {
                        min: aggregate._min.amount,
                        max: aggregate._max.amount,
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
    getCashflowSts: async ({ ctx, input }: { ctx: Context, input: geStatisticSchemaType }) => {
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
                startDate = sub(now, { days: 7 }); // Default
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
                    // Label untuk sumbu X (misal: "15 May" atau "Jan 24")
                    date: format(date, isLongRange ? 'MMM yy' : 'dd MMM'),
                    income,
                    outcome,
                    net: income - outcome // Tren bersih
                };
            });

            const ioWalletData = IOWallet.map(({ name, type, transactions }) => {
                const stats = transactions.reduce((acc, item) => {
                    const amount = Number(item.amount);
                    if (item.type === "INCOME") acc.income += amount;
                    if (item.type === "OUTCOME") acc.outcome += amount;
                    return acc;
                }, { income: 0, outcome: 0 });

                // 2. Return objek dengan hasil perhitungan
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
    getSpending: async ({ ctx, input }: { ctx: Context, input: geStatisticSchemaType }) => {
        try {
            const { range } = input;
            const now = new Date();
            let startDate: Date;

            // Logika Range Tanggal
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

            // Ambil data agregasi dan referensi secara paralel
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
                    select: { id: true, name: true, color: true }
                }),
                ctx.prisma.category.findMany({
                    where: { userId: ctx.user!.id },
                    select: { id: true, name: true, icon: true, color: true }
                })
            ]);

            // HELPER: Fungsi Mapping yang Type-Safe
            const mapData = <T extends BaseSource>(
                stats: PrismaStat[],
                sourceList: T[],
                idKey: string
            ): MappedResult[] => {
                // Filter hanya INCOME dan OUTCOME (Mengabaikan TRANSFER)
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
                            type: stat.type as "INCOME" | "OUTCOME", // Type Assertion di sini
                            amount: Number(stat._sum.amount ?? 0),
                        };
                    });
            };

            // Eksekusi Mapping
            const walletMapped = mapData(walletStatsRaw as PrismaStat[], wallets, 'walletId');
            const categoryMapped = mapData(categoryStatsRaw as PrismaStat[], categories, 'categoryId');

            // Sorting & Slicing (Top 5)
            const getTopFive = (data: MappedResult[], type: "INCOME" | "OUTCOME") => {
                return data
                    .filter(item => item.type === type)
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 5);
            };

            return {
                byWallet: {
                    topExpense: {
                        listData:getTopFive(walletMapped, 'OUTCOME'),
                        
                    },
                    topIncome: getTopFive(walletMapped, 'INCOME'),
                },
                byCategory: {
                    topExpense: getTopFive(categoryMapped, 'OUTCOME'),
                    topIncome: getTopFive(categoryMapped, 'INCOME'),
                }
            };

        } catch (error) {
            if (error instanceof TRPCError) throw error;
            console.error(error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Gagal memuat data statistik pengeluaran",
            });
        }
    }
}

interface BaseSource {
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
}

// 2. Definisikan tipe untuk data statistik dari Prisma groupBy
interface PrismaStat {
    type: "INCOME" | "OUTCOME" | string; // Mengizinkan string lain tapi mengutamakan dua ini
    _sum: {
        amount: any;
    };
    [key: string]: any;
}

// 3. Definisikan hasil akhir
interface MappedResult {
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
    type: 'INCOME' | 'OUTCOME';
    amount: number;
}