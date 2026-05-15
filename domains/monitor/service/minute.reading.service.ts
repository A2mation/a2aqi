import { redis } from "@/lib/redis";
import { getLast1HourMinuteDataRepo } from "../repo/minute.reading.repo";

const CacheKey = `monitor:device:minute:`

export async function getLast1HourMinuteDataService(deviceId: string) {
    const key = CacheKey + deviceId

    const cache = await redis.get(key);

    if (cache) {
        return JSON.parse(cache)
    }

    const readings = await getLast1HourMinuteDataRepo(deviceId);

    const cleanedReadings = readings.map(reading => {
        return Object.fromEntries(
            Object.entries(reading).filter(([_, value]) => value !== null)
        );
    });

    await redis.setex(key, 60, JSON.stringify(cleanedReadings));

    return cleanedReadings;
}