import { SensorPayload } from "./sensor.model";

export function validateSensorPayload(body: any): SensorPayload {
    const { serialNo, measuredAt } = body;

    if (!serialNo) throw new Error("serialNo is required");

    const parsedMeasuredAt = measuredAt ? new Date(measuredAt) : new Date();

    if (isNaN(parsedMeasuredAt.getTime()))
        throw new Error("measuredAt must be a valid date");

    const parseOptionalNumber = (value: any, field: string) => {
        if (value === undefined || value === null || value === "") return undefined;

        const num = Number(value);
        if (isNaN(num)) throw new Error(`${field} must be a valid number`);

        return num;
    };

    return {
        serialNo: String(serialNo),
        measuredAt: parsedMeasuredAt.toISOString(),

        // Pollution Data
        aqi: parseOptionalNumber(body.aqi, "aqi"),
        pm10: parseOptionalNumber(body.pm10, "pm10"),
        pm25: parseOptionalNumber(body.pm25, "pm25"),
        so2: parseOptionalNumber(body.so2, "so2"),
        no2: parseOptionalNumber(body.no2, "no2"),
        co2: parseOptionalNumber(body.co2, "co2"),
        co: parseOptionalNumber(body.co, "co"),
        o3: parseOptionalNumber(body.o3, "o3"),
        noise: parseOptionalNumber(body.noise, "Noise"),
        pm1: parseOptionalNumber(body.pm1, "PM1"),
        tvoc: parseOptionalNumber(body.tvoc, "tvoc"),
        smoke: parseOptionalNumber(body.smoke, "smoke"),
        methane: parseOptionalNumber(body.methane, "methane"),
        h2: parseOptionalNumber(body.h2, "h2"),
        ammonia: parseOptionalNumber(body.ammonia, "Ammonia"),
        h2s: parseOptionalNumber(body.h2s, "h2s"),

        // Weather Data
        temperature: parseOptionalNumber(body.temperature, "temperature"),
        humidity: parseOptionalNumber(body.humidity, "humidity"),
    };
}
