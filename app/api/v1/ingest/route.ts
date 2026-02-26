import { NextResponse } from "next/server";

import { validateSensorPayload } from "@/domains/sensors/sensor.validation";
import { authenticateSensor } from "@/domains/sensors/sensor.auth";
import { ingestSensorData } from "@/domains/sensors/ingestion.service";
import { sensorRateLimit } from "@/domains/sensors/sensor.ratelimit";
import { SensorError } from "@/domains/sensors/sensor.error";
import { getCalibrationFromCache } from "@/domains/sensors/sensor.calibration.service";

export async function POST(req: Request) {
    try {
        const apiKey = req.headers.get("x-api-key");

        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing API key" },
                { status: 401 }
            );
        }

        const body = await req.json();

        // Validate payload
        const payload = validateSensorPayload(body);

        // Authenticate sensor
        const device = await authenticateSensor(payload.serialNo, apiKey);

        // Rate Limiter
        await sensorRateLimit(device.id)

        // Calibration Check
        const calibration = await getCalibrationFromCache(device.id);

        if (calibration) {
            return new NextResponse(null, { status: 204 });
        }

        // Store raw + push queue job
        const raw = await ingestSensorData(payload, device.id);

        return NextResponse.json({
            message: "Raw saved and job queued",
            rawId: raw,
        }, {
            status: 200
        });

    } catch (err: any) {

        if (err instanceof SensorError) {
            return NextResponse.json(
                { error: err.message },
                { status: err.statusCode }
            );
        }
        console.log(err.command)
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }

}
