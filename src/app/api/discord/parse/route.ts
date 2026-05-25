import { parserModel } from "@/libs/gemini";
import { prisma } from "@/libs/prisma";
import { delByPattern, delCache } from "@/libs/redis";
import { createRecordSchemaExtend, discordRecordInputSchema } from "@/server/schemas/discordSchema"
import { createRecordSchema } from "@/server/schemas/recordSchema";
import { budgetCacheKeys } from "@/server/services/budgetService";
import { getInvestCacheKey } from "@/server/services/investService";
import { syncWalletHistory } from "@/server/services/recordService";
import { getMonth, getYear } from "date-fns";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        const discordId = req.headers.get("x-discord-id");

        const validation = discordRecordInputSchema.safeParse(body)
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
        const { text } = validation.data

        const [wallets, categories, investment] = await Promise.all([
            prisma.wallet.findMany({
                where: {
                    userId: user.userId
                },
                select: {
                    id: true,
                    name: true
                }
            }),
            prisma.category.findMany({
                where: {
                    userId: user.userId
                },
                select: {
                    id: true,
                    name: true
                }
            }),
            prisma.investment.findMany({
                where: {
                    userId: user.userId
                },
                select: {
                    id: true,
                    assetName: true,
                }
            })
        ])

        const prompt = `
        Context: Wallet=${JSON.stringify(wallets)}, Category=${JSON.stringify(categories)}, Now=${new Date().toISOString()}, Investment=${JSON.stringify(investment)}
        Input: "${text}"

        Output JSON Rules:
        1. Fields: type(INCOME|OUTCOME|TRANSFER), amount(num), walletId(str), date(ISO), isInvestment(bool), categoryId(str?), description(str?), toWalletId(str?), investmentId(str?).
        2. Strict: walletId & categoryId MUST exist in Context. If not found, return {"error": "NOT_FOUND"}.
        3. Description: Short summary.
        `;



        const result = await parserModel.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            },
        });
        const responseText = result.response.text()
        const rawJson = JSON.parse(responseText)

        if (rawJson.error === "NOT_FOUND") {
            return NextResponse.json({
                success: false,
                error: "Wallet or Category not recognized. Make sure the name matches."
            }, { status: 422 });
        }

        if (!rawJson.walletId || (rawJson.type !== "TRANSFER" && !rawJson.categoryId)) {
            return NextResponse.json({
                success: false,
                error: "Incomplete data (Wallet/Category not detected)."
            }, { status: 422 });
        }


        const validateData = createRecordSchemaExtend.safeParse({
            ...rawJson,
            date: new Date(rawJson.date),
            userId: user.userId
        })




        if (!validateData.success) {
            return NextResponse.json({
                success: false,
                error: "Invalid AI data",
                cause: validateData.error.message
            }, { status: 422 });
        }

        const { categoryId, isInvestment, type, toWalletId, walletId, amount, description, date, investmentId } = validateData.data

        const createdRecord = await prisma.$transaction(async (tx) => {
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
                    investmentId: investmentId || null,
                    toWalletId: type === "TRANSFER" ? toWalletId : null,
                },
                select: {
                    category: {
                        select: {
                            name: true,
                            icon: true,
                            color: true
                        }
                    },
                    amount: true,
                    wallet: {
                        select: {
                            name: true,
                            balance: true,
                            type: true
                        }
                    },
                    date: true,
                    toWallet: {
                        select: {
                            name: true,
                            balance: true,
                            type: true
                        }
                    },
                    type: true,
                    description: true,
                    isInvestment: true,
                    investment: {
                        select: {
                            assetName: true,
                            provider: true,
                            totalInvestment: true
                        }
                    }

                }
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

            return transaction
        });

        return NextResponse.json({
            data: createdRecord
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                success: false,
                error: "Invalid AI data: " + error.message
            }, { status: 422 });
        }

        console.error("PARSE_ERROR:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process transaction"
        }, { status: 500 });
    }

}