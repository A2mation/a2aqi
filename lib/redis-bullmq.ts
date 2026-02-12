import IORedis from "ioredis";

export const bullRedisConnection = new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
    tls: {},
});
