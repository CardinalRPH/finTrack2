import z from "zod";

export const getStatisticSchema = z.object({
    range: z.enum(['7D', '30D', '12W', '6M', '1Y']).optional(),
})

export type geStatisticSchemaType = z.infer<typeof getStatisticSchema>