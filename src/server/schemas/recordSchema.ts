import z from "zod";
import { EntryType } from "../../../generated/prisma/enums";

export const createRecordSchema = z.object({
    type: z.enum(EntryType),
    amount: z.number().positive(),
    walletId: z.string().min(20), // ID dompet asal
    categoryId: z.string().min(20).optional(),
    date: z.coerce.date(),
    description: z.string().optional(),

    // Optional Fields untuk logika khusus
    toWalletId: z.string().min(20).optional(), // Hanya diisi jika type === TRANSFER
    isInvestment: z.boolean().default(false), // True jika beli emas
    gramAmount: z.number().positive().optional(), // Hanya diisi jika isInvestment true
    buyPrice: z.number().positive().optional(),
    sellPrice: z.number().positive().optional(),
})

export type createRecordSchemaType = z.infer<typeof createRecordSchema>
export type CreateRecordFormInput = z.input<typeof createRecordSchema>
export type CreateRecordFormOutput = z.output<typeof createRecordSchema>


export const updateRecordSchema = z.object({
    id: z.string(),
    data: createRecordSchema
})

export type updateRecordSchemaType = z.infer<typeof updateRecordSchema>

export const deleteRecordSchema = z.object({
    id: z.string()
})

export type deleteRecordSchemaType = z.infer<typeof deleteRecordSchema>

export const getAllRecordSchema = z.object({
    range: z.enum(['7D', '30D', '12W', '6M', '1Y']).optional(),
    type: z.enum(["INCOME", "OUTCOME", "TRANSFER"]).optional(),
    walletId: z.string().optional(),
    page: z.number()
});

export type getAllRecordSchemaType = z.infer<typeof getAllRecordSchema>