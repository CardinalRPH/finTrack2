import z from "zod";

const envSchema = z.object({
    ENV: z
        .union([
            z.literal('development'),
            z.literal('testing'),
            z.literal('production'),
        ])
        .default('development'),
    DATABASE_URL: z.url(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.coerce.number(),

    AUTH_SECRET: z.string(),
    AUTH_DISCORD_CLIENT_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),

    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_PASSWORD: z.string(),
    REDIS_KEY: z.string(),

    DISCORD_BOT_KEY: z.string(),
    GEMINI_API_KEY: z.string()
})

const processEnv = envSchema.parse(process.env)

export default processEnv