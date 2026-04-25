import z from "zod";
import { EntryType } from "../../../generated/prisma/enums";

export const createRecordSchema = z.object({
    type: z.nativeEnum(EntryType),
    amount: z.number().positive("Nominal harus lebih dari 0"),
    walletId: z.string().min(1, "Dompet asal wajib dipilih"),
    categoryId: z.string().optional(), // Bisa opsional karena nanti dicover otomatis jika investasi
    date: z.coerce.date(),
    description: z.string().optional(),

    // Field Transfer
    toWalletId: z.string().optional(),

    // Field Investasi
    isInvestment: z.boolean().default(false),
    investmentId: z.string().optional(), // Link ke ID tabel Investment
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