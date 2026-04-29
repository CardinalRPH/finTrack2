import { createBudgetSchema, deleteBudgetSchema, getAllBudgetSchema, updateBudgetSchema } from "../schemas/budgetSchema";
import { budgetService } from "../services/budgetService";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const budgetRouter = createTRPCRouter({
    getAvaiYear: protectedProcedure.query(async ({ ctx }) => await budgetService.getAvailMonthYear({ ctx })),
    getAllData: protectedProcedure.input(getAllBudgetSchema).query(async ({ ctx, input }) => await budgetService.getAllData({ ctx, input })),
    updateData: protectedProcedure.input(updateBudgetSchema).mutation(async ({ ctx, input }) => await budgetService.updateData({ ctx, input })),
    createData: protectedProcedure.input(createBudgetSchema).mutation(async ({ ctx, input }) => await budgetService.createData({ ctx, input })),
    deleteData: protectedProcedure.input(deleteBudgetSchema).mutation(async ({ ctx, input }) => await budgetService.deleteData({ ctx, input }))
})