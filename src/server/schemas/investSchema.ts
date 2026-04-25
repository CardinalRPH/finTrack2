import z from "zod";

export const investCreateSchema = z.object({
    assetName: z.string(),
    provider: z.string(),
    totalInvestment: z.string()
})

export type investCreateSchemaType = z.infer<typeof investCreateSchema>

export const investUpdateSchema = investCreateSchema.extend({
    id: z.cuid()
})

export type investUpdateSchemaType = z.infer<typeof investUpdateSchema>


export const investDeleteSchema = z.object({
    id: z.cuid()
})

export type investDeleteSchemaType = z.infer<typeof investDeleteSchema>

export const investDashboardSchema = z.object({
    year: z.number()
})

export type investDashboardSchemaType = z.infer<typeof investDashboardSchema>