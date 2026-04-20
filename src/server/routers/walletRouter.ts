import { walletCreateSchema, walletDeleteSchema, walletUpdateSchema } from "../schemas/walletSchema";
import { walletService } from "../services/walletService";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const walletRouter = createTRPCRouter({
    getAllData: protectedProcedure.query(async ({ ctx }) => await walletService.getAllData({ ctx })),
    updateData: protectedProcedure.input(walletUpdateSchema).mutation(async ({ ctx, input }) => await walletService.updateData({ ctx, data: input })),
    createData: protectedProcedure.input(walletCreateSchema).mutation(async ({ ctx, input }) => await walletService.createData({ ctx, data: input })),
    deleteData: protectedProcedure.input(walletDeleteSchema).mutation(async ({ ctx, input }) => await walletService.deleteData({ ctx, wallId: input.id }))
})