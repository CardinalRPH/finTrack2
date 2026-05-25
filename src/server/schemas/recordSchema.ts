import z from "zod";

export const createRecordSchema = z.object({
    amount: z.number().positive("Nominal harus lebih dari 0"),
    walletId: z.string().min(1, "Dompet asal wajib dipilih"),
    date: z.coerce.date(),
    description: z.string().optional(),

    type: z.enum(["OUTCOME", "INCOME", "TRANSFER"]),
    isInvestment: z.boolean().default(false),

    categoryId: z.string().optional(),
    investmentId: z.string().optional(),
    toWalletId: z.string().optional(),
}).superRefine((data, ctx) => {

    // 1. ATURAN OUTCOME
    if (data.type === "OUTCOME") {
        if (data.toWalletId) {
            ctx.addIssue({
                code: "custom",
                path: ["toWalletId"],
                message: "Transfer bank tujuan harus kosong untuk outcome",
            });
        }

        if (data.isInvestment) {
            // OUTCOME + Investasi
            if (!data.investmentId || data.investmentId.trim() === "") {
                ctx.addIssue({
                    code: "custom",
                    path: ["investmentId"],
                    message: "Investment ID wajib diisi untuk pengeluaran investasi",
                });
            }
        } else {
            // OUTCOME Biasa
            if (!data.categoryId || data.categoryId.trim() === "") {
                ctx.addIssue({
                    code: "custom",
                    path: ["categoryId"],
                    message: "Kategori wajib diisi untuk pengeluaran non-investasi",
                });
            }
        }
    }

    // 2. ATURAN INCOME
    if (data.type === "INCOME") {
        if (data.isInvestment) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["isInvestment"],
                message: "Income tidak boleh berupa investasi",
            });
        }
    }

    // 3. ATURAN TRANSFER
    if (data.type === "TRANSFER") {
        if (!data.toWalletId || data.toWalletId.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["toWalletId"],
                message: "Dompet tujuan wajib dipilih untuk transfer",
            });
        }
    }
});

export const createRecordSchemaExtend = createRecordSchema.and(
    z.object({ userId: z.string() })
);

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