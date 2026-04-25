import { investCreateSchema, investDashboardSchema, investDeleteSchema, investUpdateSchema } from "../schemas/investSchema";
import { investService } from "../services/investService";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const investRouter = createTRPCRouter({
    getAllData: protectedProcedure.query(async ({ ctx }) => await investService.getAllData({ ctx })),
    updateData: protectedProcedure.input(investUpdateSchema).mutation(async ({ ctx, input }) => await investService.updateData({ ctx, input })),
    createData: protectedProcedure.input(investCreateSchema).mutation(async ({ ctx, input }) => await investService.createData({ ctx, input })),
    deleteData: protectedProcedure.input(investDeleteSchema).mutation(async ({ ctx, input }) => await investService.deleteData({ ctx, input })),
    getDashboardData: protectedProcedure.input(investDashboardSchema).query(async ({ ctx, input }) => await investService.getDashboardData({ ctx, input })),
    getDashboardYear: protectedProcedure.query(async ({ ctx }) => await investService.getAvaiYear({ ctx })),
})