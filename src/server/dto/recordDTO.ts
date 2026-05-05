import { EntryType, WalletType } from "../../../generated/prisma/enums";
import { Decimal } from "../../../generated/prisma/internal/prismaNamespace";

export type recordData = {
    data: ({
        wallet: {
            name: string;
            type: WalletType;
        };
        category: {
            name: string;
            icon: string;
            color: string;
        } | null;
        investment: {
            assetName: string;
        } | null;
        toWallet: {
            name: string;
        } | null;
    } & {
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: EntryType;
        walletId: string;
        amount: Decimal | string;
        categoryId: string | null;
        description: string | null;
        toWalletId: string | null;
        isInvestment: boolean;
        investmentId: string | null;
        userId: string;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
    };
}