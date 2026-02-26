import { Queue } from "bullmq";
import { redis } from "./redis";

export const sensorQueue = new Queue("sensor-queue", {
    connection: redis,
});
