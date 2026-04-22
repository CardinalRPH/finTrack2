import { TrendChartData } from "@/server/services/dashboardService";
import { Category } from "../categories/dto";
import { EntryType } from "../../../../generated/prisma/enums";
import { Decimal } from "@prisma/client/runtime/index-browser";

export interface DashboardStatsResponse {
    totalBalance: number;
    monthlyIncome: number;
    monthlyOutcome: number;
    totalGold: number;
    recentTransactions: TransactionWithCategory[];
    trendData: TrendChartData[];
}

export interface DashboardTransaction {
    id: string;
    date: Date;
    createdAt: Date;
    userId: string;
    walletId: string;
    categoryId: string | null;
    type: EntryType;
    amount: Decimal;
    isInvestment: boolean;
    gramAmount: Decimal | null;
    buyPrice: Decimal | null;
    sellPrice: Decimal | null;
    description: string | null;
    toWalletId: string | null;
}

export type TransactionWithCategory = DashboardTransaction & {
    category: Category | null;
};
