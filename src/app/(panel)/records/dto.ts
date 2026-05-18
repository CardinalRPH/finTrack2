import { EntryType, WalletType } from "../../../../generated/prisma/enums";

export interface Transaction {
    data: {
        wallet: {
            type: WalletType;
            name: string;
        };
        category: {
            name: string;
            icon: string;
            color: string;
        } | null;
        toWallet: {
            name: string;
        } | null;
        investment: {
            assetName: string;
        } | null;
    } & {
        type: EntryType;
        date: string;
        isInvestment: boolean;
        categoryId: string | null;
        investmentId: string | null;
        toWalletId: string | null;
        amount: string | number;
        walletId: string;
        description: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        userId: string;
    },
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number,
        hasNext: boolean,
        nextPage: number | null,
        prevPage: number | null
    }

}