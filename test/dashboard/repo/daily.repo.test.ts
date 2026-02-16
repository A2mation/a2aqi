import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

import { DailyAggregateRepo } from "@/domains/dashboard/repositories/daily-aggregate.repo";

describe("DailyAggregateRepo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return daily aggregate record for given dayStart", async () => {
        const mockData = {
            id: "1",
            deviceId: "device123",
            dayStart: new Date("2026-02-16T00:00:00.000Z"),
            count: 10,
            sumAqi: 500,
            minAqi: 20,
            maxAqi: 80,
            createdAt: new Date(),
        };

        (prismaMock.dailyAggregateReading.findFirst as any).mockResolvedValue(
            mockData
        );

        const result = await DailyAggregateRepo.findByDay(
            "device123",
            "2026-02-16T00:00:00.000Z"
        );

        expect(prismaMock.dailyAggregateReading.findFirst).toHaveBeenCalledTimes(1);

        expect(prismaMock.dailyAggregateReading.findFirst).toHaveBeenCalledWith({
            where: {
                deviceId: "device123",
                dayStart: expect.any(Date),
            },
        });

        expect(result).toEqual(mockData);
    });

    it("should return null if record not found", async () => {
        (prismaMock.dailyAggregateReading.findFirst as any).mockResolvedValue(null);

        const result = await DailyAggregateRepo.findByDay(
            "device123",
            "2026-02-16T00:00:00.000Z"
        );

        expect(result).toBeNull();
    });

    it("should throw error if prisma fails", async () => {
        (prismaMock.dailyAggregateReading.findFirst as any).mockRejectedValue(
            new Error("DB error")
        );

        await expect(
            DailyAggregateRepo.findByDay("device123", "2026-02-16T00:00:00.000Z")
        ).rejects.toThrow("DB error");
    });
});
