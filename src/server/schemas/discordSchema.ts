import z from "zod";
import { createRecordSchema } from "./recordSchema";

export const discordRecordInputSchema = z.object({
    text: z.string()
        .min(5, "Word is too short to process")
        .max(500, "excess maxmimal character (500 character)")
});

export const createRecordSchemaExtend = createRecordSchema.extend({
    userId: z.string()
})