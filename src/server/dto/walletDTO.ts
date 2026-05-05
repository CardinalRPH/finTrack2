import { WalletType } from "../../../generated/prisma/enums";
import { Decimal } from "../../../generated/prisma/internal/prismaNamespace";

export type walletDTO = {
    name: string;
    id: string;
    type: WalletType;
    balance: Decimal | string;
}