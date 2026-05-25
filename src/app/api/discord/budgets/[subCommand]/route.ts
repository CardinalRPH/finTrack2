import { prisma } from "@/libs/prisma";
import { getCache, setCache } from "@/libs/redis";
import { budgetListDTO, budgetMonthYearDTO } from "@/server/dto/budgetDTO";
import { budgetCacheKeys } from "@/server/services/budgetService";
import { endOfMonth, getMonth, getYear, startOfMonth } from "date-fns";
import { NextResponse } from "next/server";


type RouteParams = {
    params: Promise<{ subCommand: string }>;
};

export const GET = async (req: Request, context: RouteParams) => {
    try {
        const { subCommand } = await context.params;

        const discordId = req.headers.get("x-discord-id");

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

        if (subCommand === "date") {
            const cacheKey = budgetCacheKeys.AVAIL_MONTHS(user.userId);

            const cached = await getCache<budgetMonthYearDTO[]>(cacheKey);
            if (cached) {
                return NextResponse.json({
                    data: cached
                })
            };

            const data = await prisma.categoryBudget.groupBy({
                by: ['month', 'year'],
                where: {
                    userId: user.userId
                },
                orderBy: [
                    { year: 'desc' },
                    { month: 'desc' },
                ],
            })

            return NextResponse.json({
                data
            })

        } else if (isValidYYYYMM(subCommand)) {
            const year = Number(subCommand.slice(0, 4));
            const month = parseInt(subCommand.slice(4, 6), 10) - 1;
            const cacheKey = budgetCacheKeys.LIST(user.userId, `${year}-${month}`);

            const cached = await getCache<budgetListDTO>(cacheKey);
            if (cached) {
                return NextResponse.json({
                    data: cached
                })
            };

            const monthYear = new Date(year, month, 1)
            const selectedMonth = getMonth(monthYear) + 1 || getMonth(new Date());
            const selectedYear = getYear(monthYear) || getYear(new Date());
            const data = await prisma.categoryBudget.findMany({
                where: {
                    userId: user.userId,
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

            await setCache(cacheKey, JSON.stringify(result))
            return NextResponse.json({
                data
            })

        } else {
            return NextResponse.json({
                success: false,
                error: "No Command found"
            }, { status: 400 });
        }
    } catch (error) {
        console.error("error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to process transaction"
        }, { status: 500 });
    }
}

const isValidYYYYMM = (value: string): boolean => {

    if (!/^\d{6}$/.test(value)) {
        return false;
    }

    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6));

    // valid month
    if (month < 1 || month > 12) {
        return false;
    }

    // optional year range
    if (year < 2000 || year > 2100) {
        return false;
    }

    return true;
}
