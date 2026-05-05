import { getStatisticSchema } from "../schemas/statisticSchema";
import { statisticService } from "../services/statisticService";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const statisticRouter = createTRPCRouter({
    getBalance: protectedProcedure.input(getStatisticSchema).query(async ({ ctx, input }) => await statisticService.getBalanceSts({ ctx, input })),
    getCashFlow: protectedProcedure.input(getStatisticSchema).query(async ({ ctx, input }) => await statisticService.getCashflowSts({ ctx, input })),
    getSpending: protectedProcedure.input(getStatisticSchema).query(async ({ ctx, input }) => await statisticService.getSpending({ ctx, input })),
    getReport: protectedProcedure.input(getStatisticSchema).query(async ({ ctx, input }) => await statisticService.getReport({ ctx, input })),
})