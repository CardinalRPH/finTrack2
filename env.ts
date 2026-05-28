import z from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'testing', 'production'])
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

const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Invalid Variable:");
            console.error(JSON.stringify(error.format(), null, 2));
        } else {
            console.error("Error on reading file:", error);
        }
    }
}

const processEnv = parseEnv()!

export default processEnv