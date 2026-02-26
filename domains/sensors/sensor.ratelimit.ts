import { getDeviceKey } from "@/helpers/cashKeys"
import { redis } from "@/lib/redis"
import { SensorError } from "./sensor.error";

export async function sensorRateLimit(deviceId: string) {
    const key = getDeviceKey(deviceId);

    const result = await redis.call(
        "SET",
        key,
        "1",
        "NX",
        "EX",
        "60"
    );

    if (!result) {
        throw new SensorError("Rate limit exceeded. Only 1 request per minute allowed.", 429);
    }
}
