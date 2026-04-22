import { dashboardService } from "../services/dashboardService";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dashboardRouter = createTRPCRouter({
    getData: protectedProcedure.query(async ({ ctx }) => await dashboardService.getData({ ctx })),
})