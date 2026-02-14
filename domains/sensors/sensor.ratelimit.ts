import { getDeviceKey } from "@/helpers/cashKeys"
import { redis } from "@/lib/redis"
import { SensorError } from "./sensor.error";

export async function sensorRateLimit(deviceId: string) {
    const key = getDeviceKey(deviceId);

    const result = await redis.set(key, "1", {
        nx: true,
        ex: 60,
    });

    if (!result) {
        throw new SensorError("Rate limit exceeded. Only 1 request per minute allowed.", 429);
    }
}
