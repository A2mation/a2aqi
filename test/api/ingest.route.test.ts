import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

vi.mock("@/lib/queue", () => ({
    sensorQueue: {
        add: vi.fn(),
    },
}));

import { sensorQueue } from "@/lib/queue";
import { POST } from "@/app/api/ingest/route";

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
        prismaMock.device.findUnique.mockResolvedValue({
            id: "65f123abc456def7890abc12",
            apiKey: "secret",
            isActive: true,
        } as any);

        prismaMock.sensorReading.create.mockResolvedValue({
            id: "raw123",
        } as any);

        const req = new Request("http://localhost/api/ingest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "secret",
            },
            body: JSON.stringify({
                serialNo: "65f123abc456def7890abc12",
                pm25: 10,
                pm10: 20,
            }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.rawId).toBe("raw123");
        expect(sensorQueue.add).toHaveBeenCalledTimes(1);
    });

    it("should return error if device not found", async () => {
        prismaMock.device.findUnique.mockResolvedValue(null);

        const req = new Request("http://localhost/api/ingest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "secret",
            },
            body: JSON.stringify({
                serialNo: "65f123abc456def7890abc12",
                pm25: 10,
                pm10: 20,
            }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(json.error).toBe("Device not found");
    });
});
