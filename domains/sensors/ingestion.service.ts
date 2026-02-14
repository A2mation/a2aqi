import { sensorQueue } from "@/lib/queue";
import { storeRawSensorReading } from "./sensor.service";
import { SensorPayload } from "./sensor.model";

export async function ingestSensorData(payload: SensorPayload, deviceId: string) {
    const measuredAt = payload.measuredAt
        ? new Date(payload.measuredAt)
        : new Date();

    const raw = deviceId

    // Push job to worker queue
    await sensorQueue.add("sensor-data", {
        deviceId: deviceId,
        measuredAt: measuredAt.toISOString(),

        aqi: payload.aqi,
        pm10: payload.pm10,
        pm25: payload.pm25,
        so2: payload.so2,
        no2: payload.no2,
        co2: payload.co2,
        co: payload.co,
        o3: payload.o3,
        noise: payload.noise,
        pm1: payload.pm1,
        tvoc: payload.tvoc,
        smoke: payload.smoke,
        methane: payload.methane,
        h2: payload.h2,
        ammonia: payload.ammonia,
        h2s: payload.h2s,

        temperature: payload.temperature,
        humidity: payload.humidity,
    }, {
        removeOnComplete: true,
        removeOnFail: { age: 86400 }, // Storing for 1 day
    });

    return raw;
}
