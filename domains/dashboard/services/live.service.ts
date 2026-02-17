import { SensorReadingRepo } from "../repositories/sensor-reading.repo";

export class LiveService {
    static async getLive(deviceId: string) {
        const latest = await SensorReadingRepo.getLatest(deviceId);

        if (!latest) return null;

        return {
            measuredAt: latest.measuredAt,

            // AQI + Particulates
            aqi: latest.aqi ?? null,
            pm1: latest.pm1 ?? null,
            pm25: latest.pm25 ?? null,
            pm10: latest.pm10 ?? null,

            // Gases
            so2: latest.so2 ?? null,
            no2: latest.no2 ?? null,
            co2: latest.co2 ?? null,
            co: latest.co ?? null,
            o3: latest.o3 ?? null,

            // VOCs & others
            tvoc: latest.tvoc ?? null,
            smoke: latest.smoke ?? null,
            methane: latest.methane ?? null,
            h2: latest.h2 ?? null,
            ammonia: latest.ammonia ?? null,
            h2s: latest.h2s ?? null,

            // Environment
            noise: latest.noise ?? null,
            temperature: latest.temperature ?? null,
            humidity: latest.humidity ?? null,
        };
    }
}
