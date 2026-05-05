import { Decimal } from "../../../generated/prisma/internal/prismaNamespace";
import { categoryDTO } from "./categoryDTO";

export type budgetMonthYearDTO = {
    month: number
    year: number
}

export type budgetListDTO = {
    budgetData: {
        id: string;
        amount: Decimal;
        monthYear: string;
        category: Omit<categoryDTO, "id">
        spended: number;
    }[];
    totalSpent: number;
    remaining: number;
    totalBudget: number;
}