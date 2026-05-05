import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { createBudgetSchemaType, deleteBudgetSchemaType, getAllBudgetSchemaType, updateBudgetSchemaType } from "../schemas/budgetSchema";
import { endOfMonth, getMonth, getYear, startOfMonth } from "date-fns";
import { budgetListDTO, budgetMonthYearDTO } from "../dto/budgetDTO";

export const budgetCacheKeys = {
    AVAIL_MONTHS: (userId: string) => `budget:avail:${userId}`,
    LIST: (userId: string, monthYear: string) => `budget:list:${userId}:${monthYear}`,
};

export const budgetService = {
    getAvailMonthYear: async ({ ctx }: { ctx: Context }) => {
        const cacheKey = budgetCacheKeys.AVAIL_MONTHS(ctx.user!.id);
        try {
            const cached = await ctx.cache.getCache<budgetMonthYearDTO[]>(cacheKey);
            if (cached) return { data: cached };

            const data = await ctx.prisma.categoryBudget.groupBy({
                by: ['month', 'year'],
                where: {
                    userId: ctx.user!.id,
                },
                orderBy: [
                    { year: 'desc' },
                    { month: 'desc' },
                ],
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
    getAllData: async ({ ctx, input }: { ctx: Context, input: getAllBudgetSchemaType }) => {
        const cacheKey = budgetCacheKeys.LIST(ctx.user!.id, `${getYear(input.monthYear)}-${getMonth(input.monthYear) + 1}`);
        try {

            const cached = await ctx.cache.getCache<budgetListDTO>(cacheKey);
            if (cached) return { data: cached };

            const { monthYear } = input
            const selectedMonth = getMonth(monthYear) + 1 || getMonth(new Date());
            const selectedYear = getYear(monthYear) || getYear(new Date());
            const data = await ctx.prisma.categoryBudget.findMany({
                where: {
                    userId: ctx.user!.id,
                    month: selectedMonth,
                    year: selectedYear,
                },
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    amount: true,
                    month: true,
                    year: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            icon: true,
                            color: true,
                            transactions: {
                                select: {
                                    amount: true,
                                },
                                where: {
                                    date: {
                                        gte: startOfMonth(monthYear),
                                        lte: endOfMonth(monthYear)
                                    }
                                }
                            }
                        },
                    },
                }
            })
            const dataFix = data.map(val => ({
                id: val.id,
                amount: val.amount,
                monthYear: `${val.year}-${val.month}`,
                category: {
                    name: val.category.name,
                    icon: val.category.icon,
                    color: val.category.color
                },
                spended: val.category.transactions.reduce((sum, itm) => sum + Number(itm.amount), 0)

            }))
            const totalBudget = dataFix.reduce((sum, itm) => sum + Number(itm.amount), 0)
            const totalSpent = dataFix.reduce((sum, itm) => sum + itm.spended, 0)
            const remaining = Number(totalBudget) - totalSpent

            const result = {
                budgetData: dataFix,
                totalSpent,
                remaining,
                totalBudget,
            }

            await ctx.cache.setCache(cacheKey, JSON.stringify(result))
            return {
                data: result
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
    createData: async ({ ctx, input }: { ctx: Context, input: createBudgetSchemaType }) => {
        try {
            const [year, month] = input.monthYear.split("-").map(Number);
            const data = await ctx.prisma.categoryBudget.create({
                data: {
                    amount: input.amount,
                    categoryId: input.categoryId,
                    year,
                    month,
                    userId: ctx.user!.id
                }
            })

            await ctx.cache.delCache(budgetCacheKeys.LIST(ctx.user!.id, input.monthYear));
            await ctx.cache.delCache(budgetCacheKeys.AVAIL_MONTHS(ctx.user!.id));

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
    updateData: async ({ ctx, input }: { ctx: Context, input: updateBudgetSchemaType }) => {
        try {
            const [year, month] = input.monthYear.split("-").map(Number);
            const data = await ctx.prisma.categoryBudget.update({
                data: {
                    amount: input.amount,
                    categoryId: input.categoryId,
                    month: month,
                    year: year
                },
                where: {
                    userId: ctx.user!.id,
                    id: input.id
                }
            })

            await ctx.cache.delCache(budgetCacheKeys.LIST(ctx.user!.id, input.monthYear));
            await ctx.cache.delCache(budgetCacheKeys.AVAIL_MONTHS(ctx.user!.id));

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
    deleteData: async ({ ctx, input }: { ctx: Context, input: deleteBudgetSchemaType }) => {
        try {

            const target = await ctx.prisma.categoryBudget.findUnique({
                where: { id: input.id }
            });

            await ctx.prisma.categoryBudget.delete({
                where: {
                    id: input.id,
                    userId: ctx.user!.id
                }
            })

            if (target) {
                const my = `${target.year}-${target.month}`;
                await ctx.cache.delCache(budgetCacheKeys.LIST(ctx.user!.id, my));
                await ctx.cache.delCache(budgetCacheKeys.AVAIL_MONTHS(ctx.user!.id));
            }

            return {
                message: "Data deleted"
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
}