import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { createRecordSchemaType, deleteRecordSchemaType, getAllRecordSchemaType, updateRecordSchemaType } from "../schemas/recordSchema";
import { endOfDay, getMonth, getYear, startOfDay, sub } from "date-fns";
import { TransactionClient } from "../../../generated/prisma/internal/prismaNamespace";
import { recordData } from "../dto/recordDTO";
import { getDashboardCacheKey } from "./dashboardService";

const syncWalletHistory = async (tx: TransactionClient, walletId: string, userId: string, date: Date) => {
    const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) return;

    const historyDate = new Date(date);
    historyDate.setHours(0, 0, 0, 0);

    await tx.walletHistory.upsert({
        where: {
            walletId_date: { walletId, date: historyDate }
        },
        update: { balance: wallet.balance },
        create: {
            walletId,
            userId,
            balance: wallet.balance,
            date: historyDate
        }
    });
};
const getRecordCacheKey = {
    list: (userId: string, range: string, type: string, walletId: string, page: number) =>
        `records:list:${userId}:${range}:${type || 'all'}:${walletId || 'all'}:${page}`,
    listPattern: (userId: string) => `records:list:${userId}:*`,
};

// Fungsi pembersihan cache pusat untuk service ini
const invalidateRecordCache = async (ctx: Context) => {
    const userId = ctx.user!.id;
    // 1. Hapus semua list records (pagination & filter)
    await ctx.cache.delByPattern(getRecordCacheKey.listPattern(userId));

    // 2. Hapus cache dashboard (karena saldo/cashflow pasti berubah)
    await ctx.cache.delCache(getDashboardCacheKey(userId));

    // 3. Opsional: Jika ada cache lain seperti total saldo wallet, hapus di sini
    // await ctx.cache.delCache(`wallets:total:${userId}`);
};


export const recordService = {
    createData: async ({ ctx, data }: { ctx: Context, data: createRecordSchemaType }) => {
        try {
            const {
                type, amount, walletId, categoryId,
                toWalletId, isInvestment, date, description,
                investmentId,
            } = data;

            const created = await ctx.prisma.$transaction(async (tx) => {
                let finalCategoryId = categoryId;

                // 1. LOGIKA KATEGORI OTOMATIS
                if (isInvestment) {
                    const existCategory = await tx.category.findFirst({
                        where: { userId: ctx.user!.id, name: "CTX.Invest" }
                    });
                    if (!existCategory) {
                        const newCat = await tx.category.create({
                            data: { name: "CTX.Invest", userId: ctx.user!.id, icon: "GiGoldBar", color: "#f5db33" }
                        });
                        finalCategoryId = newCat.id;
                    } else {
                        finalCategoryId = existCategory.id;
                    }
                } else if (type === "TRANSFER" && toWalletId) {
                    const existCategory = await tx.category.findFirst({
                        where: { userId: ctx.user!.id, name: "CTX.Transfer" }
                    });
                    if (!existCategory) {
                        const newCat = await tx.category.create({
                            data: { name: "CTX.Transfer", userId: ctx.user!.id, icon: "HiArrowsRightLeft", color: "#33e8f5" }
                        });
                        finalCategoryId = newCat.id;
                    } else {
                        finalCategoryId = existCategory.id;
                    }
                }

                // 2. CREATE TRANSACTION RECORD
                const transaction = await tx.transaction.create({
                    data: {
                        userId: ctx.user!.id,
                        walletId,
                        categoryId: finalCategoryId,
                        type,
                        amount,
                        isInvestment,
                        description,
                        date: date,
                        investmentId,
                        toWalletId: type === "TRANSFER" ? toWalletId : null,
                    },
                });

                // 3. UPDATE SALDO WALLET
                if (type === "INCOME") {
                    await tx.wallet.update({
                        where: { id: walletId },
                        data: { balance: { increment: amount } },
                    });
                } else {
                    await tx.wallet.update({
                        where: { id: walletId },
                        data: { balance: { decrement: amount } },
                    });
                    await syncWalletHistory(tx, walletId, ctx.user!.id, date);
                    if (type === "TRANSFER" && toWalletId) {
                        if (walletId === toWalletId) throw new TRPCError({ code: "BAD_REQUEST", message: "Cant transfer to the same wallet" });
                        await tx.wallet.update({
                            where: { id: toWalletId },
                            data: { balance: { increment: amount } },
                        });
                        await syncWalletHistory(tx, toWalletId, ctx.user!.id, date);
                    }
                }
                // 4. LOGIKA INVESTMENT (Price Shifting)
                // Di dalam Prisma Transaction saat membuat record baru
                if (isInvestment && investmentId) {

                    await tx.investment.update({
                        where: { id: investmentId, userId: ctx.user!.id },
                        data: {
                            totalInvestment: {
                                increment: amount
                            }
                        }
                    });
                }

                const currMonth = getMonth(date) + 1
                const currYear = getYear(date)

                const budgetData = await tx.categoryBudget.findFirst({
                    where: {
                        userId: ctx.user!.id,
                        categoryId: finalCategoryId,
                        year: currYear,
                        month: currMonth
                    }
                })

                if (budgetData) {
                    await tx.categoryBudget.update({
                        where: {
                            id: budgetData.id
                        },
                        data: {
                            amount: Number(budgetData.amount) - amount
                        }
                    })
                }

                return transaction;
            });

            return { data: created };
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

    updateData: async ({ ctx, input }: { ctx: Context, input: updateRecordSchemaType }) => {
        try {
            const { id, data } = input;

            const updated = await ctx.prisma.$transaction(async (tx) => {
                const oldRecord = await tx.transaction.findUnique({
                    where: { id, userId: ctx.user!.id },
                });

                if (!oldRecord) throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" });
                if (oldRecord.type === "INCOME") {
                    await tx.wallet.update({ where: { id: oldRecord.walletId }, data: { balance: { decrement: oldRecord.amount } } });
                } else {
                    await tx.wallet.update({ where: { id: oldRecord.walletId }, data: { balance: { increment: oldRecord.amount } } });
                    if (oldRecord.type === "TRANSFER" && oldRecord.toWalletId) {
                        await tx.wallet.update({ where: { id: oldRecord.toWalletId }, data: { balance: { decrement: oldRecord.amount } } });
                    }
                }

                const updatedTransaction = await tx.transaction.update({
                    where: { id },
                    data: {
                        walletId: data.walletId,
                        categoryId: data.categoryId,
                        type: data.type,
                        amount: data.amount,
                        description: data.description,
                        date: data.date,
                        isInvestment: data.isInvestment,
                        investmentId: data.investmentId,
                        toWalletId: data.type === "TRANSFER" ? data.toWalletId : null,
                    },
                });

                // Wallet New
                if (data.type === "INCOME") {
                    await tx.wallet.update({ where: { id: data.walletId }, data: { balance: { increment: data.amount } } });
                } else {
                    await tx.wallet.update({ where: { id: data.walletId }, data: { balance: { decrement: data.amount } } });
                    if (data.type === "TRANSFER" && data.toWalletId) {
                        await tx.wallet.update({ where: { id: data.toWalletId }, data: { balance: { increment: data.amount } } });
                    }
                }

                await syncWalletHistory(tx, data.walletId, ctx.user!.id, data.date);
                if (data.type === "TRANSFER" && data.toWalletId) {
                    await syncWalletHistory(tx, data.toWalletId, ctx.user!.id, data.date);
                }

                // Investment Price Update (Optional: Only if price changed)
                if (data.isInvestment && data.investmentId) {
                    const investData = await tx.investment.findUnique({
                        where: {
                            id: data.investmentId
                        }
                    })
                    if (!investData) {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "No invest data founded" });
                    }
                    const ttlInvest = Number(investData.totalInvestment) - Number(oldRecord.amount) + data.amount
                    await tx.investment.update({
                        where: { id: data.investmentId },
                        data: { totalInvestment: ttlInvest }
                    });
                }

                // investment update if new data not isInvestment and old data isInvestment
                if (!data.isInvestment && !data.investmentId && oldRecord.isInvestment && oldRecord.investmentId) {
                    const investData = await tx.investment.findUnique({
                        where: {
                            id: oldRecord.investmentId
                        }
                    })
                    if (!investData) {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "No invest data founded" });
                    }
                    const ttlInvest = Number(investData.totalInvestment) - Number(oldRecord.amount)
                    await tx.investment.update({
                        where: { id: investData.id },
                        data: { totalInvestment: ttlInvest }
                    });
                }

                //investment update if new data isInvestment and old data not isInvestment
                if (data.isInvestment && data.investmentId && !oldRecord.isInvestment && !oldRecord.investmentId) {
                    const investData = await tx.investment.findUnique({
                        where: {
                            id: data.investmentId
                        }
                    })
                    if (!investData) {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "No invest data founded" });
                    }

                    const ttlInvest = Number(investData.totalInvestment) + data.amount
                    await tx.investment.update({
                        where: { id: investData.id },
                        data: { totalInvestment: ttlInvest }
                    });

                }

                // invalidate investment redis

                const oldCurrMonth = getMonth(oldRecord.date) + 1
                const oldCurrYear = getYear(oldRecord.date)
                const newCurrMonth = getMonth(oldRecord.date) + 1
                const newCurrYear = getYear(oldRecord.date)

                const newbudgetData = await tx.categoryBudget.findFirst({
                    where: {
                        userId: ctx.user!.id,
                        categoryId: data.categoryId,
                        year: newCurrYear,
                        month: newCurrMonth
                    }
                })

                if (newbudgetData) {
                    // invalidate redis budget
                }

                // update budget if the budget same but value different
                if (data.categoryId === oldRecord.categoryId) {
                    if (oldCurrMonth === newCurrMonth && oldCurrYear === newCurrYear && Number(oldRecord.amount) !== data.amount) {
                        const budgetData = await tx.categoryBudget.findFirst({
                            where: {
                                userId: ctx.user!.id,
                                categoryId: oldRecord.categoryId,
                                year: oldCurrYear,
                                month: oldCurrMonth
                            }
                        })
                        if (!budgetData) {
                            throw new TRPCError({ code: "BAD_REQUEST", message: "No budget data founded" });
                        }
                        const ttlBudget = Number(budgetData.amount) + Number(oldRecord.amount) - data.amount
                        await tx.categoryBudget.update({
                            where: {
                                id: budgetData.id
                            },
                            data: {
                                amount: ttlBudget
                            }
                        })

                    }
                    if (oldCurrMonth !== newCurrMonth || oldCurrYear !== newCurrYear) {
                        const oldBudgetData = await tx.categoryBudget.findFirst({
                            where: {
                                userId: ctx.user!.id,
                                categoryId: oldRecord.categoryId,
                                year: oldCurrYear,
                                month: oldCurrMonth
                            }
                        })
                        if (!oldBudgetData || !newbudgetData) {
                            throw new TRPCError({ code: "BAD_REQUEST", message: "No budget data founded" });
                        }
                        await tx.categoryBudget.update({
                            where: { id: oldBudgetData.id },
                            data: {
                                amount: Number(oldBudgetData.amount) + Number(oldRecord.amount)
                            }
                        })
                        await tx.categoryBudget.update({
                            where: { id: newbudgetData.id },
                            data: {
                                amount: Number(newbudgetData.amount) - data.amount
                            }
                        })
                    }
                }
                if (oldRecord.categoryId && data.categoryId && oldRecord.categoryId !== data.categoryId) {
                    const oldBudgetData = await tx.categoryBudget.findFirst({
                        where: {
                            userId: ctx.user!.id,
                            categoryId: oldRecord.categoryId,
                            year: oldCurrYear,
                            month: oldCurrMonth
                        }
                    })
                    if (!oldBudgetData || !newbudgetData) {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "No budget data founded" });
                    }
                    await tx.categoryBudget.update({
                        where: { id: oldBudgetData.id },
                        data: {
                            amount: Number(oldBudgetData.amount) + Number(oldRecord.amount)
                        }
                    })
                    await tx.categoryBudget.update({
                        where: { id: newbudgetData.id },
                        data: {
                            amount: Number(newbudgetData.amount) - data.amount
                        }
                    })
                }


                return updatedTransaction;
            });

            return { data: updated };
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

    deleteData: async ({ ctx, input }: { ctx: Context, input: deleteRecordSchemaType }) => {
        try {
            await ctx.prisma.$transaction(async (tx) => {
                const transaction = await tx.transaction.findUnique({
                    where: { id: input.id, userId: ctx.user!.id },
                });

                if (!transaction) throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" });
                if (!transaction.categoryId) throw new TRPCError({ code: "NOT_FOUND", message: "Transaction category not found" });

                // REVERSE WALLET
                if (transaction.type === "INCOME") {
                    await tx.wallet.update({ where: { id: transaction.walletId }, data: { balance: { decrement: transaction.amount } } });
                } else {
                    await tx.wallet.update({ where: { id: transaction.walletId }, data: { balance: { increment: transaction.amount } } });
                    if (transaction.type === "TRANSFER" && transaction.toWalletId) {
                        await tx.wallet.update({ where: { id: transaction.toWalletId }, data: { balance: { decrement: transaction.amount } } });
                    }
                }

                if (transaction.isInvestment && transaction.investmentId) {
                    const investData = await tx.investment.findUnique({
                        where: {
                            id: transaction.investmentId
                        }
                    })
                    if (!investData) {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "No invest data founded" });
                    }
                    const ttlInvest = Number(investData.totalInvestment) - Number(transaction.amount)
                    await tx.investment.update({
                        where: {
                            id: investData.id
                        },
                        data: {
                            totalInvestment: ttlInvest
                        }
                    })

                }

                const currMonth = getMonth(transaction.date) + 1
                const currYear = getYear(transaction.date)

                const budgetData = await tx.categoryBudget.findFirst({
                    where: {
                        categoryId: transaction.categoryId,
                        year: currYear,
                        month: currMonth
                    }
                })

                if (budgetData) {
                    const budValue = Number(budgetData.amount) + Number(transaction.amount)
                    await tx.categoryBudget.update({
                        where: {
                            id: budgetData.id
                        },
                        data: {
                            amount: budValue
                        }
                    })
                }

                // invalidate redis cache

                await tx.transaction.delete({ where: { id: input.id } });

                await syncWalletHistory(tx, transaction.walletId, ctx.user!.id, transaction.date);
                if (transaction.type === "TRANSFER" && transaction.toWalletId) {
                    await syncWalletHistory(tx, transaction.toWalletId, ctx.user!.id, transaction.date);
                }
            });


            return { message: "Data deleted" };
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

    getAllData: async ({ ctx, input }: { ctx: Context, input: getAllRecordSchemaType }) => {
        try {
            const { range, type, walletId, page } = input;


            const limit = 20;
            const skip = (page - 1) * limit;

            let dateFilter = {};
            if (range) {
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
                    startDate = startOfDay(now);
                }

                dateFilter = { date: { gte: startDate, lte: endOfDay(now) } };
            }

            const [data, total] = await Promise.all([
                ctx.prisma.transaction.findMany({
                    take: limit,
                    skip,
                    where: { userId: ctx.user!.id, ...dateFilter, ...(type && { type }), ...(walletId && { walletId }) },
                    include: {
                        category: { select: { name: true, icon: true, color: true } },
                        wallet: { select: { name: true, type: true } },
                        toWallet: { select: { name: true } },
                        investment: { select: { assetName: true } }
                    },
                    orderBy: { date: 'desc' },
                }),
                ctx.prisma.transaction.count({
                    where: { userId: ctx.user!.id, ...dateFilter, ...(type && { type }), ...(walletId && { walletId }) }
                }),

            ]);

            const result = {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: data.length === limit,
                }
            }

            return result
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
};

