import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { categoryCreateSchemaType, categoryUpdateSchemaType } from "../schemas/categorySchema";

export const categoryService = {
    getAllData: async ({ ctx }: { ctx: Context }) => {
        try {
            const data = await ctx.prisma.category.findMany({
                where: {
                    userId: ctx.user!.id
                },
                orderBy: {
                    name: "asc"
                },
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    color: true
                }
            })

            return {
                data
            }

        } catch (error) {
            if (error instanceof TRPCError) {
                throw error
            }
            console.error(error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create user",
            })
        }
    },
    updateData: async ({ ctx, data }: { ctx: Context, data: categoryUpdateSchemaType }) => {
        try {
            const updated = await ctx.prisma.category.update({
                data: {
                    color: data.color,
                    icon: data.icon,
                    name: data.name
                },
                where: {
                    id: data.id,
                    userId: ctx.user!.id
                },
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    color: true
                }
            })

            return {
                data: updated
            }

        } catch (error) {
            if (error instanceof TRPCError) {
                throw error
            }
            console.error(error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create user",
            })
        }

    },
    createData: async ({ ctx, data }: { ctx: Context, data: categoryCreateSchemaType }) => {
        try {
            const createdData = await ctx.prisma.category.create({
                data: {
                    ...data,
                    userId: ctx.user!.id
                },
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    color: true
                }
            })

            return {
                data: createdData
            }
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error
            }
            console.error(error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create user",
            })
        }
    },
    deleteData: async ({ ctx, catId }: { ctx: Context, catId: string }) => {
        try {
            await ctx.prisma.category.delete({
                where: {
                    id: catId,
                    userId: ctx.user!.id
                }
            })

            return {
                message: "Data deleted"
            }
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error
            }
            console.error(error)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create user",
            })
        }
    },
}