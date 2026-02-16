import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";
import { validateSensorPayload } from "@/domains/sensors/sensor.validation";
import { authenticateSensor } from "@/domains/sensors/sensor.auth";
import { ingestSensorData } from "@/domains/sensors/ingestion.service";
import { sensorRateLimit } from "@/domains/sensors/sensor.ratelimit";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

vi.mock("@/lib/queue", () => ({
    sensorQueue: {
        add: vi.fn(),
    },
}));

vi.mock("@/domains/sensors/sensor.validation", () => ({
    validateSensorPayload: vi.fn(),
}));

vi.mock("@/domains/sensors/sensor.auth", () => ({
    authenticateSensor: vi.fn(),
}));

vi.mock("@/domains/sensors/ingestion.service", () => ({
    ingestSensorData: vi.fn(),
}));

vi.mock("@/domains/sensors/sensor.ratelimit", () => ({
    sensorRateLimit: vi.fn(),
}));

import { sensorQueue } from "@/lib/queue";
import { POST } from "@/app/api/ingest/route";
import { SensorError } from "@/domains/sensors/sensor.error";

describe("POST /api/ingest", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 401 if api key missing", async () => {
        const req = new Request("http://localhost/api/ingest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                deviceId: "65f123abc456def7890abc12",
                pm25: 10,
                pm10: 20,
            }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe("Missing API key");
    });

    it("should return 200 and queue job if valid", async () => {
        (validateSensorPayload as any).mockReturnValue({
            serialNo: "raw123",
            pm25: 10,
            pm10: 20,
        });

        (authenticateSensor as any).mockResolvedValue({
            id: "65f123abc456def7890abc12",
            serialNo: "raw123",
            apiKey: "secret",
            isActive: true,
        });

        (sensorRateLimit as any).mockResolvedValue(true);

        (ingestSensorData as any).mockResolvedValue("65f123abc456def7890abc12");

        const req = new Request("http://localhost/api/ingest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "secret",
            },
            body: JSON.stringify({
                serialNo: "raw123",
                pm25: 10,
                pm10: 20,
            }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.rawId).toBe("65f123abc456def7890abc12");

        expect(validateSensorPayload).toHaveBeenCalledTimes(1);
        expect(authenticateSensor).toHaveBeenCalledTimes(1);
        expect(sensorRateLimit).toHaveBeenCalledTimes(1);
        expect(ingestSensorData).toHaveBeenCalledTimes(1);
    });


    it("should return error if device not found", async () => {
        (validateSensorPayload as any).mockReturnValue({
            serialNo: "raw123",
            pm25: 10,
            pm10: 20,
        });

        (authenticateSensor as any).mockRejectedValue(
            new SensorError("Device not found", 404)
        );

        const req = new Request("http://localhost/api/ingest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "secret",
            },
            body: JSON.stringify({
                serialNo: "raw123",
                pm25: 10,
                pm10: 20,
            }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe("Device not found");
    });

});
