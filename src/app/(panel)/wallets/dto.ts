import { WalletType } from "../../../../generated/prisma/enums"

export interface Wallet {
    id: string;
    name: string;
    type: WalletType;
    balance: string;
}