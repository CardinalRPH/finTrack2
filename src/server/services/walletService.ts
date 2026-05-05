import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { walletCreateSchemaType, walletUpdateSchemaType } from "../schemas/walletSchema";
import { walletDTO } from "../dto/walletDTO";

const getWaletCacheKey = (userId: string) => `wallet:${userId}`;
export const walletService = {
    getAllData: async ({ ctx }: { ctx: Context }) => {
        const cacheKey = getWaletCacheKey(ctx.user!.id)
        try {
            const cached = await ctx.cache.getCache<walletDTO[]>(cacheKey);

            if (cached) {
                return { data: cached };
            }

            const data = await ctx.prisma.wallet.findMany({
                where: {
                    userId: ctx.user!.id
                },
                orderBy: {
                    name: "asc"
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    balance: true
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
    updateData: async ({ ctx, data }: { ctx: Context, data: walletUpdateSchemaType }) => {
        const cacheKey = getWaletCacheKey(ctx.user!.id)
        try {
            const updated = await ctx.prisma.wallet.update({
                data: {
                    name: data.name,
                    balance: data.balance
                },
                where: {
                    id: data.id,
                    userId: ctx.user!.id
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    balance: true,
                    createdAt: true
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
    createData: async ({ ctx, data }: { ctx: Context, data: walletCreateSchemaType }) => {
        const cacheKey = getWaletCacheKey(ctx.user!.id)
        try {

            const existed = await ctx.prisma.wallet.findFirst({
                where: {
                    type: data.type
                }
            })
            if (existed) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "This wallet is existed"
                })
            }
            const createddat = await ctx.prisma.wallet.create({
                data: {
                    ...data,
                    userId: ctx.user!.id
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    balance: true,
                    createdAt: true
                }
            })

            await ctx.cache.delCache(cacheKey)

            return {
                data: createddat
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
    deleteData: async ({ ctx, wallId }: { ctx: Context, wallId: string }) => {
        const cacheKey = getWaletCacheKey(ctx.user!.id)
        try {
            await ctx.prisma.wallet.delete({
                where: {
                    id: wallId,
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