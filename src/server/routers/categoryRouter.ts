import { categoryCreateSchema, categoryDeleteSchema, categoryUpdateSchema } from "../schemas/categorySchema";
import { categoryService } from "../services/categoryService";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
    getAllData: protectedProcedure.query(async ({ ctx }) => await categoryService.getAllData({ ctx })),
    updateData: protectedProcedure.input(categoryUpdateSchema).mutation(async ({ ctx, input }) => await categoryService.updateData({ ctx, data: input })),
    createData: protectedProcedure.input(categoryCreateSchema).mutation(async ({ ctx, input }) => await categoryService.createData({ ctx, data: input })),
    deleteData: protectedProcedure.input(categoryDeleteSchema).mutation(async ({ ctx, input }) => await categoryService.deleteData({ ctx, catId: input.id }))
})