import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { investCreateSchemaType, investDashboardSchemaType, investDeleteSchemaType, investUpdateSchemaType } from "../schemas/investSchema";
import { endOfYear, startOfYear } from "date-fns";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const investService = {
    createData: async ({ ctx, input }: { ctx: Context, input: investCreateSchemaType }) => {
        try {
            const createdData = await ctx.prisma.investment.create({
                data: {
                    ...input,
                    userId: ctx.user!.id
                },
                select: {
                    id: true,
                    assetName: true,
                    provider: true,
                    totalInvestment: true,
                }
            })

            return {
                data: createdData
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
    updateData: async ({ ctx, input }: { ctx: Context, input: investUpdateSchemaType }) => {
        try {
            const updated = await ctx.prisma.investment.update({
                where: {
                    id: input.id,
                    userId: ctx.user!.id
                },
                data: {
                    assetName: input.assetName,
                    provider: input.provider,
                    totalInvestment: input.totalInvestment
                },
                select: {
                    id: true,
                    assetName: true,
                    provider: true,
                    totalInvestment: true,
                }
            })

            return {
                data: updated
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
    deleteData: async ({ ctx, input }: { ctx: Context, input: investDeleteSchemaType }) => {
        try {
            await ctx.prisma.investment.delete({
                where: {
                    id: input.id,
                    userId: ctx.user!.id
                }
            })
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
    getAllData: async ({ ctx }: { ctx: Context }) => {
        try {
            const data = await ctx.prisma.investment.findMany({
                where: {
                    userId: ctx.user!.id
                },
                select: {
                    id: true,
                    assetName: true,
                    provider: true,
                    totalInvestment: true,
                }
            })

            return {
                data
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
    getDashboardData: async ({ ctx, input }: { ctx: Context, input: investDashboardSchemaType }) => {
        try {
            const { year } = input
            const baseDate = new Date(year, 0, 1);
            const data = await ctx.prisma.investment.findMany({
                select: {
                    transactions: {
                        where: {
                            date: {
                                gte: startOfYear(baseDate),
                                lte: endOfYear(baseDate),
                            },
                            NOT: {
                                investmentId: null,
                            },
                        },
                        select: {
                            date: true,
                            amount: true
                        }
                    },
                    assetName: true,
                    provider: true,
                    id: true,
                    totalInvestment: true,
                },
                where: {
                    userId: ctx.user!.id,

                },

                orderBy: {
                    assetName: 'asc'
                }
            })

            const monthlyValues = new Array(12).fill(0);

            const chartData = data.map((inv) => {
                const totalAssetYearly = inv.transactions.reduce((sum, tx) => {
                    const val = Number(tx.amount);
                    const monthIndex = new Date(tx.date).getMonth();

                    // Masukkan ke keranjang bulan yang sesuai
                    monthlyValues[monthIndex] += val;

                    return sum + val;
                }, 0);

                return { name: inv.assetName, value: totalAssetYearly };
            });

            const lineData = months.map((name, i) => ({
                name,
                value: monthlyValues[i]
            }));


            const fixData = data.map(({ transactions, ...rest }) => rest)
            const totalInvest = fixData.reduce((sum, inv) => sum + Number(inv.totalInvestment), 0)



            return {
                data: {
                    graph: {
                        lineData,
                        chartData
                    },
                    list: fixData,
                    totalInvest
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
    getAvaiYear: async ({ ctx }: { ctx: Context }) => {
        const dataYear = await ctx.prisma.transaction.findMany({
            where: {
                userId: ctx.user!.id,
                investmentId: { not: null }
            },
            select: {
                date: true
            },
            orderBy: {
                date: 'asc'
            }
        })

        let years: number[] = []

        years = Array.from(
            new Set(dataYear.map(tx => new Date(tx.date).getFullYear()))
        );
        if (years.length === 0) {
            years = [new Date().getFullYear()]
        }

        return {
            data: years
        }
    }
}