import { EntryType } from "../../../generated/prisma/enums"
import { Decimal } from "../../../generated/prisma/internal/prismaNamespace"

export type getDashboardDataDTO = {
    totalBalance: number
    monthlyIncome: number
    monthlyOutcome: number
    totalInvest: number
    recentTransactions: ({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            icon: string;
            color: string;
        } | null;
    } & {
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: EntryType;
        userId: string;
        walletId: string;
        categoryId: string | null;
        investmentId: string | null;
        isInvestment: boolean;
        amount: Decimal;
        toWalletId: string | null;
    })[]
    trendData: {
        cashFlow: {
            date: string;
            income: number;
            outcome: number;
        }[]
        investYear: {
            date: string;
            amount: number;
        }[]
        netWorth: {
            date: string;
            balance: number;
        }[]
    },
    trendsSumary: {
        totalBalance: number
        totalInvest: number
        monthlyIncome: number
        monthlyOutcome: number
    }
}