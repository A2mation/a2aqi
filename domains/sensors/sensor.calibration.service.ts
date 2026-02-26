import { calibrationKey } from "@/constant/Calibration.key";
import { redis } from "@/lib/redis";
import { CalibrationValues } from "@/types/type";


export async function getCalibrationFromCache(
    deviceId: string
): Promise<CalibrationValues | null> {
    const cached = await redis.get(calibrationKey(deviceId));

    if (!cached) return null;

    return JSON.parse(cached) as CalibrationValues;
}