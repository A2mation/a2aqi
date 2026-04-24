import { sensorQueue } from "@/lib/queue";
import { SensorPayload } from "./sensor.model";
import { JsonValue } from "@prisma/client/runtime/library";

interface Device {
    model: {
        parameters: JsonValue;
    };
    id: string;
    isActive: boolean;
    apiKey: string;
}

type ParameterList = string[];

export async function ingestSensorData(payload: SensorPayload, deviceId: string, device: Device) {
    const measuredAt = payload.measuredAt
        ? new Date(payload.measuredAt)
        : new Date();

    const raw = deviceId

    const allowedParams = device.model.parameters as ParameterList;

    const filteredData: Record<string, any> = {};

    for (const key of allowedParams) {
        filteredData[key] = payload[key as keyof SensorPayload] ?? null;
    }

    // Push job to worker queue
    await sensorQueue.add("sensor-data", {
        deviceId: deviceId,
        measuredAt: measuredAt.toISOString(),

        ...filteredData,
    }, {
        removeOnComplete: true,
        removeOnFail: { age: 86400 }, // Storing for 1 day
    });

    return raw;
}
