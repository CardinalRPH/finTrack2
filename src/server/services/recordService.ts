import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { createRecordSchemaType, deleteRecordSchemaType, getAllRecordSchemaType, updateRecordSchemaType } from "../schemas/recordSchema";
import { getMonth, getYear } from "date-fns";

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

                    if (type === "TRANSFER" && toWalletId) {
                        if (walletId === toWalletId) throw new TRPCError({ code: "BAD_REQUEST", message: "Cant transfer to the same wallet" });
                        await tx.wallet.update({
                            where: { id: toWalletId },
                            data: { balance: { increment: amount } },
                        });
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

                const budgetData = await tx.categoryBudget.findUnique({
                    where: {
                        userId: ctx.user!.id,
                        id: finalCategoryId,
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
            if (error instanceof TRPCError) throw error;
            console.error(error);
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Gagal membuat record" });
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

                return updatedTransaction;
            });

            return { data: updated };
        } catch (error) {
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Gagal memperbarui record" });
        }
    },

    deleteData: async ({ ctx, input }: { ctx: Context, input: deleteRecordSchemaType }) => {
        try {
            await ctx.prisma.$transaction(async (tx) => {
                const transaction = await tx.transaction.findUnique({
                    where: { id: input.id, userId: ctx.user!.id },
                });

                if (!transaction) throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" });

                // REVERSE WALLET
                if (transaction.type === "INCOME") {
                    await tx.wallet.update({ where: { id: transaction.walletId }, data: { balance: { decrement: transaction.amount } } });
                } else {
                    await tx.wallet.update({ where: { id: transaction.walletId }, data: { balance: { increment: transaction.amount } } });
                    if (transaction.type === "TRANSFER" && transaction.toWalletId) {
                        await tx.wallet.update({ where: { id: transaction.toWalletId }, data: { balance: { decrement: transaction.amount } } });
                    }
                }

                await tx.transaction.delete({ where: { id: input.id } });
            });

            return { message: "Data deleted" };
        } catch (error) {
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Gagal menghapus data" });
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
                let startDate = new Date();
                if (range === '7D') startDate.setDate(now.getDate() - 7);
                else if (range === '30D') startDate.setDate(now.getDate() - 30);
                else if (range === '6M') startDate.setMonth(now.getMonth() - 6);
                else if (range === '1Y') startDate.setFullYear(now.getFullYear() - 1);

                dateFilter = { date: { gte: startDate, lte: now } };
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
                })
            ]);

            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: data.length === limit,
                }
            };
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Gagal mengambil data" });
        }
    }
};