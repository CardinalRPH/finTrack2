import { prisma } from "@/libs/prisma";
import { delByPattern, delCache, getCache, setCache } from "@/libs/redis";
import { createRecordSchema } from "@/server/schemas/recordSchema";
import { budgetCacheKeys } from "@/server/services/budgetService";
import { getDashboardCacheKey } from "@/server/services/dashboardService";
import { getInvestCacheKey } from "@/server/services/investService";
import { getRecordCacheKey, syncWalletHistory } from "@/server/services/recordService";
import { clearAllStatsCache } from "@/server/services/statisticService";
import { getMonth, getYear } from "date-fns";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        const discordId = req.headers.get("x-discord-id");

        const validation = createRecordSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: validation.error.message
            }, { status: 400 });
        }

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

        const {
            type, amount, walletId, categoryId,
            toWalletId, isInvestment, date, description,
            investmentId,
        } = validation.data;

        const created = await prisma.$transaction(async (tx) => {
            let finalCategoryId = categoryId;

            // 1. LOGIKA KATEGORI OTOMATIS
            if (isInvestment) {
                const existCategory = await tx.category.findFirst({
                    where: { userId: user.userId, name: "CTX.Invest" }
                });
                if (!existCategory) {
                    const newCat = await tx.category.create({
                        data: { name: "CTX.Invest", userId: user.userId, icon: "GiGoldBar", color: "#f5db33" }
                    });
                    finalCategoryId = newCat.id;
                } else {
                    finalCategoryId = existCategory.id;
                }
            } else if (type === "TRANSFER" && toWalletId) {
                const existCategory = await tx.category.findFirst({
                    where: { userId: user.userId, name: "CTX.Transfer" }
                });
                if (!existCategory) {
                    const newCat = await tx.category.create({
                        data: { name: "CTX.Transfer", userId: user.userId, icon: "HiArrowsRightLeft", color: "#33e8f5" }
                    });
                    finalCategoryId = newCat.id;
                } else {
                    finalCategoryId = existCategory.id;
                }
            }

            // 2. CREATE TRANSACTION RECORD
            const transaction = await tx.transaction.create({
                data: {
                    userId: user.userId,
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
                await syncWalletHistory(tx, walletId, user.userId, date);
                if (type === "TRANSFER" && toWalletId) {
                    if (walletId === toWalletId) {
                        return NextResponse.json({
                            success: false,
                            error: "Cant transfer to the same wallet"
                        }, { status: 400 });
                    }
                    await tx.wallet.update({
                        where: { id: toWalletId },
                        data: { balance: { increment: amount } },
                    });
                    await syncWalletHistory(tx, toWalletId, user.userId, date);
                }
            }
            if (isInvestment && investmentId) {
                await tx.investment.update({
                    where: { id: investmentId, userId: user.userId },
                    data: {
                        totalInvestment: {
                            increment: amount
                        }
                    }
                });
                // invalidate budget invest
                await delCache(getInvestCacheKey.data(user.userId))
                await delCache(getInvestCacheKey.year(user.userId))
                await delByPattern(getInvestCacheKey.dashboardPattern(user.userId))
            }

            const currMonth = getMonth(date) + 1
            const currYear = getYear(date)

            const budgetData = await tx.categoryBudget.findFirst({
                where: {
                    userId: user.userId,
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
                // invalidate budget redis
                await delByPattern(budgetCacheKeys.LIST_PATTERN(user.userId))
                await delCache(budgetCacheKeys.AVAIL_MONTHS(user.userId))
            }

            return transaction;
        });

        //invalidate record redis
        await delByPattern(getRecordCacheKey.listPattern(user.userId));
        //invalidate stats redis
        await clearAllStatsCache({ delByPattern, delCache, getCache, setCache }, user.userId)
        //invalidate dashboard redis
        await delCache(getDashboardCacheKey(user.userId))

        return NextResponse.json({
            data: created
        });
    } catch (error) {
        console.error("error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process transaction"
        }, { status: 500 });
    }
}