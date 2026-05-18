import z from "zod";

const baseRecordSchema = {
    amount: z.number().positive("Nominal harus lebih dari 0"),
    walletId: z.string().min(1, "Dompet asal wajib dipilih"),
    date: z.coerce.date(),
    description: z.string().optional(),
};

export const createRecordSchema = z.discriminatedUnion("type", [
    z.object({
        ...baseRecordSchema,
        type: z.literal("OUTCOME"),
        isInvestment: z.literal(false).default(false),
        categoryId: z.string().min(1, "Kategori wajib diisi untuk pengeluaran non-investasi"),
        investmentId: z.undefined().describe("Investment ID harus kosong jika bukan investasi"),
        toWalletId: z.undefined().describe("Transfer bank tujuan harus kosong untuk outcome"),
    }),
    z.object({
        ...baseRecordSchema,
        type: z.literal("OUTCOME"),
        isInvestment: z.literal(true),
        investmentId: z.string().min(1, "Investment ID wajib diisi untuk pengeluaran investasi"),
        categoryId: z.undefined().describe("Category harus kosong jika berinvestasi"),
        toWalletId: z.undefined().describe("Transfer bank tujuan harus kosong untuk outcome"),
    }),
    z.object({
        ...baseRecordSchema,
        type: z.literal("INCOME"),
        categoryId: z.undefined(),
        isInvestment: z.literal(false).default(false),
        investmentId: z.undefined(),
        toWalletId: z.undefined(),
    }),
    z.object({
        ...baseRecordSchema,
        type: z.literal("TRANSFER"),
        categoryId: z.undefined(),
        toWalletId: z.string().min(1, "Dompet tujuan wajib dipilih untuk transfer"),
        isInvestment: z.literal(false).default(false),
        investmentId: z.undefined(),
    }),
]);

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