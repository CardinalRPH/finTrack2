import z from "zod";

export const getAllBudgetSchema = z.object({
    monthYear: z.coerce.date()
})

export type getAllBudgetSchemaType = z.infer<typeof getAllBudgetSchema>

export const createBudgetSchema = z.object({
    amount: z.number().positive(),
    monthYear: z.string().min(7),
    categoryId: z.string()
})

export type createBudgetSchemaType = z.infer<typeof createBudgetSchema>

export const updateBudgetSchema = createBudgetSchema.extend({
    id: z.string()
})

export type updateBudgetSchemaType = z.infer<typeof updateBudgetSchema>

export const deleteBudgetSchema = z.object({
    id: z.string()
})

export type deleteBudgetSchemaType = z.infer<typeof deleteBudgetSchema>