import { createRecordSchema, deleteRecordSchema, getAllRecordSchema, updateRecordSchema } from "../schemas/recordSchema";
import { recordService } from "../services/recordService";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const recordRouter = createTRPCRouter({
    getAllData: protectedProcedure.input(getAllRecordSchema).query(async ({ ctx, input }) => await recordService.getAllData({ ctx, input })),
    updateData: protectedProcedure.input(updateRecordSchema).mutation(async ({ ctx, input }) => await recordService.updateData({ ctx, input })),
    createData: protectedProcedure.input(createRecordSchema).mutation(async ({ ctx, input }) => await recordService.createData({ ctx, data: input })),
    deleteData: protectedProcedure.input(deleteRecordSchema).mutation(async ({ ctx, input }) => await recordService.deleteData({ ctx, input }))
})