import { Queue } from "bullmq";
import { bullRedisConnection } from "./redis-bullmq";

export const sensorQueue = new Queue("sensor-queue", {
    connection: bullRedisConnection,
});
