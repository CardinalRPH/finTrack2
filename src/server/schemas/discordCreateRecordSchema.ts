import z from "zod";

export const createRecordIncomeSchema = z.object({
    amount: z.number().positive("Nominal harus lebih dari 0"),
    walletId: z.string().min(1, "Dompet asal wajib dipilih"),
    categoryId: z.string().optional(), // Bisa opsional karena nanti dicover otomatis jika investasi
    date: z.coerce.date(),
    description: z.string().optional(),
})