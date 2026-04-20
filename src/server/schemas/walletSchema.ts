import z from "zod";
import { WalletType } from "../../../generated/prisma/enums";

export const walletCreateSchema = z.object({
    name: z.string().min(3).max(75),
    type: z.enum(WalletType),
    balance: z.number().min(0),
})

export type walletCreateSchemaType = z.infer<typeof walletCreateSchema>

export const walletUpdateSchema = walletCreateSchema.extend({
    id: z.cuid()
})

export type walletUpdateSchemaType = z.infer<typeof walletUpdateSchema>

export const walletDeleteSchema = z.object({
    id: z.cuid()
})