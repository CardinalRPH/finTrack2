import z from "zod";

export const createRecordSchema = z.object({
    type: z.enum(["INCOME", "OUTCOME", "TRANSFER"]),
    amount: z.number().positive(),
    walletId: z.string(), // ID dompet asal
    categoryId: z.string().optional(), // Bisa kosong jika TRANSFER
    date: z.date().default(new Date()),
    description: z.string().optional(),

    // Optional Fields untuk logika khusus
    toWalletId: z.string().optional(), // Hanya diisi jika type === TRANSFER
    isInvestment: z.boolean().default(false), // True jika beli emas
    gramAmount: z.number().optional(), // Hanya diisi jika isInvestment true
})

export type createRecordSchemaType = z.infer<typeof createRecordSchema>


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
});

export type getAllRecordSchemaType = z.infer<typeof getAllRecordSchema>