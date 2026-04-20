import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { createRecordSchemaType, deleteRecordSchemaType, getAllRecordSchemaType, updateRecordSchemaType } from "../schemas/recordSchema";

export const recordService = {
    createData: async ({ ctx, data }: { ctx: Context, data: createRecordSchemaType }) => {
        try {
            const {
                type, amount, walletId, categoryId,
                toWalletId, isInvestment, gramAmount, date, description
            } = data;
            const created = await ctx.prisma.$transaction(async (tx) => {
                const transaction = await tx.transaction.create({
                    data: {
                        userId: ctx.user!.id,
                        walletId,
                        categoryId,
                        type,
                        amount,
                        description,
                        date,
                        isInvestment,
                        gramAmount,
                        toWalletId: type === "TRANSFER" ? toWalletId : null,
                    },
                });

                // 2. UPDATE SALDO DOMPET ASAL (WALLET)
                if (type === "INCOME") {
                    await tx.wallet.update({
                        where: { id: walletId },
                        data: { balance: { increment: amount } },
                    });
                } else {
                    // OUTCOME atau TRANSFER akan mengurangi saldo dompet asal
                    await tx.wallet.update({
                        where: { id: walletId },
                        data: { balance: { decrement: amount } },
                    });
                }

                // 3. LOGIKA KHUSUS: TRANSFER
                if (type === "TRANSFER" && toWalletId) {
                    // Tambah saldo ke dompet tujuan
                    await tx.wallet.update({
                        where: { id: toWalletId },
                        data: { balance: { increment: amount } },
                    });
                }

                if (isInvestment && gramAmount) {
                    await tx.investment.upsert({
                        where: { userId: ctx.user!.id },
                        create: {
                            userId: ctx.user!.id,
                            totalGrams: gramAmount,
                            // Rumus simpel avg price: Total Bayar / Gram yang didapat
                            avgBuyPrice: amount / gramAmount,
                        },
                        update: {
                            // Kita perlu ambil data lama dulu untuk hitung rata-rata harga baru (Optional logic)
                            totalGrams: { increment: gramAmount },
                            // Di sini kamu bisa tambahkan logic matematika untuk avgBuyPrice yang lebih akurat
                        },
                    });
                }

                return transaction;
            });

            return {
                data: created
            }
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error
            }
            console.error(error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create user",
            })
        }
    },
    updateData: async ({ ctx, input }: { ctx: Context, input: updateRecordSchemaType }) => {
        try {
            const { id, data } = input;

            const updated = await ctx.prisma.$transaction(async (tx) => {
                // 1. AMBIL DATA LAMA (Untuk kalkulasi balik saldo)
                const oldRecord = await tx.transaction.findUnique({
                    where: { id, userId: ctx.user!.id },
                });

                if (!oldRecord) throw new Error("Transaction not found");

                // 2. REVERSE (BATALKAN) EFEK LAMA PADA DOMPET
                if (oldRecord.type === "INCOME") {
                    await tx.wallet.update({
                        where: { id: oldRecord.walletId },
                        data: { balance: { decrement: oldRecord.amount } },
                    });
                } else if (oldRecord.type === "OUTCOME" || oldRecord.type === "TRANSFER") {
                    await tx.wallet.update({
                        where: { id: oldRecord.walletId },
                        data: { balance: { increment: oldRecord.amount } },
                    });

                    // Jika dulu adalah transfer, kembalikan saldo di dompet tujuan
                    if (oldRecord.type === "TRANSFER" && oldRecord.toWalletId) {
                        await tx.wallet.update({
                            where: { id: oldRecord.toWalletId },
                            data: { balance: { decrement: oldRecord.amount } },
                        });
                    }
                }

                // 3. REVERSE EFEK INVESTASI (Jika dulu adalah investasi)
                if (oldRecord.isInvestment && oldRecord.gramAmount) {
                    await tx.investment.update({
                        where: { userId: ctx.user!.id },
                        data: { totalGrams: { decrement: oldRecord.gramAmount } },
                    });
                }

                // 4. APPLY (TERAPKAN) DATA BARU
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
                        gramAmount: data.gramAmount,
                        toWalletId: data.type === "TRANSFER" ? data.toWalletId : null,
                    },
                });

                // 5. UPDATE SALDO DOMPET DENGAN DATA BARU
                if (data.type === "INCOME") {
                    await tx.wallet.update({
                        where: { id: data.walletId },
                        data: { balance: { increment: data.amount } },
                    });
                } else {
                    await tx.wallet.update({
                        where: { id: data.walletId },
                        data: { balance: { decrement: data.amount } },
                    });

                    if (data.type === "TRANSFER" && data.toWalletId) {
                        await tx.wallet.update({
                            where: { id: data.toWalletId },
                            data: { balance: { increment: data.amount } },
                        });
                    }
                }

                // 6. UPDATE SALDO EMAS DENGAN DATA BARU
                if (data.isInvestment && data.gramAmount) {
                    await tx.investment.update({
                        where: { userId: ctx.user!.id },
                        data: { totalGrams: { increment: data.gramAmount } },
                    });
                }

                return updatedTransaction;
            });

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
                message: "Failed to create user",
            })
        }
    },
    deleteData: async ({ ctx, input }: { ctx: Context, input: deleteRecordSchemaType }) => {
        try {
            await ctx.prisma.$transaction(async (tx) => {
                // 1. CARI DATA LAMA UNTUK IDENTIFIKASI EFEK SALDO
                const transaction = await tx.transaction.findUnique({
                    where: {
                        id: input.id,
                        userId: ctx.user!.id // Keamanan: Pastikan hanya pemilik yang bisa hapus
                    },
                });

                if (!transaction) {
                    throw new Error("Transaction not found or unauthorized");
                }

                // 2. BATALKAN EFEK PADA DOMPET (WALLET)
                if (transaction.type === "INCOME") {
                    // Jika dulu uang masuk, sekarang hapus = kurangi saldo
                    await tx.wallet.update({
                        where: { id: transaction.walletId },
                        data: { balance: { decrement: transaction.amount } },
                    });
                } else if (transaction.type === "OUTCOME" || transaction.type === "TRANSFER") {
                    // Jika dulu uang keluar, sekarang hapus = kembalikan saldo
                    await tx.wallet.update({
                        where: { id: transaction.walletId },
                        data: { balance: { increment: transaction.amount } },
                    });

                    // Jika itu adalah transfer, tarik kembali saldo dari dompet tujuan
                    if (transaction.type === "TRANSFER" && transaction.toWalletId) {
                        await tx.wallet.update({
                            where: { id: transaction.toWalletId },
                            data: { balance: { decrement: transaction.amount } },
                        });
                    }
                }

                if (transaction.isInvestment && transaction.gramAmount) {
                    await tx.investment.update({
                        where: { userId: ctx.user!.id },
                        data: { totalGrams: { decrement: transaction.gramAmount } },
                    });
                }

                // 4. HAPUS TRANSAKSI SECARA PERMANEN
                await tx.transaction.delete({
                    where: { id: input.id },
                });

                return { success: true };
            });

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
                message: "Failed to create user",
            })
        }
    },
    getAllData: async ({ ctx, input }: { ctx: Context, input: getAllRecordSchemaType }) => {
        try {
            const { range, type, walletId } = input;

            // 1. Logika Filter Tanggal
            let dateFilter = {};
            if (range) {
                const now = new Date();
                let startDate = new Date();

                if (range === '7D') startDate.setDate(now.getDate() - 7);
                else if (range === '30D') startDate.setDate(now.getDate() - 30);
                else if (range === '12W') startDate.setDate(now.getDate() - (12 * 7));
                else if (range === '6M') startDate.setMonth(now.getMonth() - 6);
                else if (range === '1Y') startDate.setFullYear(now.getFullYear() - 1);

                dateFilter = {
                    date: {
                        gte: startDate,
                        lte: now,
                    },
                };
            }

            // 2. Query ke Database
            const transactions = await ctx.prisma.transaction.findMany({
                where: {
                    userId: ctx.user!.id,
                    ...dateFilter,
                    ...(type && { type }), // Filter tipe jika ada
                    ...(walletId && { walletId }), // Filter wallet jika ada
                },
                include: {
                    category: {
                        select: { name: true, icon: true, color: true }
                    },
                    wallet: {
                        select: { name: true, type: true }
                    },
                    toWallet: {
                        select: { name: true }
                    }
                },
                orderBy: {
                    date: 'desc', // Terbaru di atas
                },
            });

            return transactions;
        } catch (error) {

        }
    }
}