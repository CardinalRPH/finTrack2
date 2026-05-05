import { Decimal } from "../../../generated/prisma/internal/prismaNamespace";

export type investDataDTO = {
    id: string;
    assetName: string;
    provider: string;
    totalInvestment: Decimal | string;
}

export type investDashboardDTO = {
    graph: {
        lineData: {
            name: string;
            value: any;
        }[];
        chartData: {
            name: string;
            value: number;
        }[];
    };
    list: {
        id: string;
        assetName: string;
        provider: string;
        totalInvestment: Decimal;
    }[];
    totalInvest: number;
}

export type investAvaiYear = number