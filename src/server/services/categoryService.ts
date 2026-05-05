import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { categoryCreateSchemaType, categoryUpdateSchemaType } from "../schemas/categorySchema";
import { categoryDTO } from "../dto/categoryDTO";

const getCacheKey = (userId: string) => `categories:${userId}`;
export const categoryService = {
    getAllData: async ({ ctx }: { ctx: Context }) => {
        const cacheKey = getCacheKey(ctx.user!.id)
        try {
            const cached = await ctx.cache.getCache<categoryDTO[]>(cacheKey);

            if (cached) {
                return { data: cached };
            }


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

            await ctx.cache.setCache(cacheKey, JSON.stringify(data));

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
                message: "Internal Server Error",
            })
        }
    },
    updateData: async ({ ctx, data }: { ctx: Context, data: categoryUpdateSchemaType }) => {
        const cacheKey = getCacheKey(ctx.user!.id)
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

            await ctx.cache.delCache(cacheKey)

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
                message: "Internal Server Error",
            })
        }

    },
    createData: async ({ ctx, data }: { ctx: Context, data: categoryCreateSchemaType }) => {
        const cacheKey = getCacheKey(ctx.user!.id)
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

            await ctx.cache.delCache(cacheKey)

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
                message: "Internal Server Error",
            })
        }
    },
    deleteData: async ({ ctx, catId }: { ctx: Context, catId: string }) => {
        const cacheKey = getCacheKey(ctx.user!.id)
        try {
            await ctx.prisma.category.delete({
                where: {
                    id: catId,
                    userId: ctx.user!.id
                }
            })

            await ctx.cache.delCache(cacheKey)

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
                message: "Internal Server Error",
            })
        }
    },
}