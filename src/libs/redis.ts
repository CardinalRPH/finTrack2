import Redis from "ioredis";
import processEnv from "../../env";

const redis = new Redis({
    host: processEnv.REDIS_HOST,
    port: processEnv.REDIS_PORT,
    password: processEnv.REDIS_PASSWORD,
    keyPrefix: processEnv.REDIS_KEY
})

redis.on("connect", () => {
    console.log("Redis connected")
})

redis.on("error", (err) => {
    console.error(`Redis Error ${err.message}`)
})


const redisIsReady = redis.status === "ready";


export const setCache = async (key: string, value: string, ttl = 3600) => {
    if (redisIsReady) {
        await redis.set(key, value, "EX", ttl);
    }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
    if (!redisIsReady) return null;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};

export const delCache = async (key: string) => {
    if (redisIsReady) await redis.del(key);
};

export const delByPattern = (pattern: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const stream = redis.scanStream({
            match: pattern,
            count: 100,
        });

        stream.on("data", async (keys: string[]) => {
            if (keys.length > 0) {
                const pipeline = redis.pipeline();

                keys.forEach((key) => {
                    pipeline.unlink(key);
                });

                stream.pause();
                try {
                    await pipeline.exec();
                } catch (err) {
                    reject(err);
                }
                stream.resume();
            }
        });

        stream.on("error", (err) => reject(err));
        stream.on("end", () => resolve());
    });
}

export default redis