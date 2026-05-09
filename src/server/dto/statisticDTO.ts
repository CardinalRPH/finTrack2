import { Decimal } from "@prisma/client/runtime/index-browser";
import { walletDTO } from "./walletDTO";
import { WalletType } from "../../../generated/prisma/enums";

export type stsBalanceDTO = {
    wallet: Omit<walletDTO, "id">[],
    aggregate: {
        max_income: {
            amount: Decimal | string;
            category: {
                name: string;
            } | null;
        } | null,
        max_outcome: {
            amount: Decimal;
            category: {
                name: string;
            } | null;
        } | null
    },
    trendData: {
        label: string;
        income: number;
        outcome: number;
        net: number;
    }[]
}

export type stsCashFlowDTO = {
    totalIncome: Decimal | string | null;
    totalOutcome: Decimal | string | null;
    totalNetworth: number;
    walletData: {
        name: string;
        type: WalletType;
        income: number;
        outcome: number;
        networth: number;
    }[];
    chartData: {
        date: string;
        income: number;
        outcome: number;
        net: number;
    }[];
}

export type stsSpendingDTO = {
    byWallet: {
        topExpense: MappedResult[];
        topIncome: MappedResult[];
    };
    byCategory: {
        topExpense: MappedResult[];
        topIncome: MappedResult[];
    };
}

export type stsReportDTO = {
    metrics: {
        income: {
            count: number;
            totalAmount: number;
            averagePerDay: number;
            averagePerRecord: number;
        };
        expenses: {
            count: number;
            totalAmount: number;
            averagePerDay: number;
            averagePerRecord: number;
        };
        netCashFlow: number;
    };
    byWallet: InOutReport[];
    byCategory: InOutReport[];
}


export interface BaseSource {
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
}

export interface PrismaStat {
    type: "INCOME" | "OUTCOME" | string;
    _sum: {
        amount: any;
    };
    [key: string]: any;
}

export interface MappedResult {
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
    type: 'INCOME' | 'OUTCOME';
    amount: number;
}


// Interface untuk item referensi (Wallet atau Category)
export interface ResourceItem {
    id: string;
    name: string;
}

// Interface untuk data statistik dari Prisma
export interface StatResult {
    type: string;
    _sum: {
        amount: Decimal | number | null;
    };
    [key: string]: any; // Mengizinkan akses dinamis ke walletId atau categoryId
}

// Interface untuk hasil transformasi
export interface InOutReport {
    name: string;
    in: number;
    out: number;
}