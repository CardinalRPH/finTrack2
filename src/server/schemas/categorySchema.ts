import z from "zod";

export const categoryCreateSchema = z.object({
    name: z.string().min(3).max(75),
    icon: z.string().min(3),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        message: "Invalid hex color format. Use #RGB or #RRGGBB",
    })
})

export type categoryCreateSchemaType = z.infer<typeof categoryCreateSchema>

export const categoryUpdateSchema = categoryCreateSchema.extend({
    id: z.cuid()
})

export type categoryUpdateSchemaType = z.infer<typeof categoryUpdateSchema>

export const categoryDeleteSchema = z.object({
    id: z.cuid()
})