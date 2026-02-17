import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

import { SensorReadingRepo } from "@/domains/dashboard/repositories/sensor-reading.repo";

describe("SensorReadingRepo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return latest sensor reading", async () => {
        const mockReading = {
            id: "reading123",
            deviceId: "device123",
            measuredAt: new Date("2026-02-16T10:00:00.000Z"),
            pm25: 10,
            pm10: 20,
        };

        (prismaMock.sensorReading.findFirst as any).mockResolvedValue(mockReading);

        const result = await SensorReadingRepo.getLatest("device123");

        expect(prismaMock.sensorReading.findFirst).toHaveBeenCalledTimes(1);
        expect(prismaMock.sensorReading.findFirst).toHaveBeenCalledWith({
            where: { deviceId: "device123" },
            orderBy: { measuredAt: "desc" },
        });

        expect(result).toEqual(mockReading);
    });

    it("should return null if no latest reading exists", async () => {
        (prismaMock.sensorReading.findFirst as any).mockResolvedValue(null);

        const result = await SensorReadingRepo.getLatest("device123");

        expect(result).toBeNull();
    });

    it("should return sensor readings in range", async () => {
        const start = new Date("2026-02-16T10:00:00.000Z");
        const end = new Date("2026-02-16T10:15:00.000Z");

        const mockData = [
            {
                id: "reading1",
                deviceId: "device123",
                measuredAt: new Date("2026-02-16T10:05:00.000Z"),
                pm25: 10,
            },
            {
                id: "reading2",
                deviceId: "device123",
                measuredAt: new Date("2026-02-16T10:10:00.000Z"),
                pm25: 12,
            },
        ];

        (prismaMock.sensorReading.findMany as any).mockResolvedValue(mockData);

        const result = await SensorReadingRepo.findRange("device123", start, end);

        expect(prismaMock.sensorReading.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.sensorReading.findMany).toHaveBeenCalledWith({
            where: {
                deviceId: "device123",
                measuredAt: {
                    gte: start,
                    lt: end,
                },
            },
            orderBy: { measuredAt: "asc" },
        });

        expect(result).toEqual(mockData);
    });

    it("should throw error if prisma fails", async () => {
        (prismaMock.sensorReading.findMany as any).mockRejectedValue(
            new Error("DB error")
        );

        const start = new Date("2026-02-16T10:00:00.000Z");
        const end = new Date("2026-02-16T10:15:00.000Z");

        await expect(
            SensorReadingRepo.findRange("device123", start, end)
        ).rejects.toThrow("DB error");
    });
});
