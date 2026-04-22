import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { walletCreateSchemaType, walletUpdateSchemaType } from "../schemas/walletSchema";

export const walletService = {
    getAllData: async ({ ctx }: { ctx: Context }) => {
        try {
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
        try {
            await ctx.prisma.wallet.delete({
                where: {
                    id: wallId,
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
                message: "Internal Server Error",
            })
        }
    },
}