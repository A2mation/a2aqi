import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

import { YearlyAggregateRepo } from "@/domains/dashboard/repositories/yearly-aggregate.repo";

describe("YearlyAggregateRepo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return yearly daily aggregates for the given year", async () => {
        const mockData = [
            {
                id: "1",
                deviceId: "device123",
                dayStart: new Date("2026-01-01T00:00:00.000Z"),
                count: 100,
                sumAqi: 5000,
                minAqi: 10,
                maxAqi: 100,
                createdAt: new Date(),
            },
            {
                id: "2",
                deviceId: "device123",
                dayStart: new Date("2026-02-01T00:00:00.000Z"),
                count: 200,
                sumAqi: 12000,
                minAqi: 15,
                maxAqi: 150,
                createdAt: new Date(),
            },
        ];

        (prismaMock.dailyAggregateReading.findMany as any).mockResolvedValue(
            mockData
        );

        const result = await YearlyAggregateRepo.findByYear("device123", 2026);

        expect(prismaMock.dailyAggregateReading.findMany).toHaveBeenCalledTimes(1);

        expect(prismaMock.dailyAggregateReading.findMany).toHaveBeenCalledWith({
            where: {
                deviceId: "device123",
                dayStart: {
                    gte: new Date(Date.UTC(2026, 0, 1)),
                    lt: new Date(Date.UTC(2027, 0, 1)),
                },
            },
            orderBy: { dayStart: "asc" },
        });

        expect(result).toEqual(mockData);
    });

    it("should return empty array if no records exist", async () => {
        (prismaMock.dailyAggregateReading.findMany as any).mockResolvedValue([]);

        const result = await YearlyAggregateRepo.findByYear("device123", 2026);

        expect(result).toEqual([]);
    });

    it("should throw error if prisma query fails", async () => {
        (prismaMock.dailyAggregateReading.findMany as any).mockRejectedValue(
            new Error("DB error")
        );

        await expect(
            YearlyAggregateRepo.findByYear("device123", 2026)
        ).rejects.toThrow("DB error");
    });
});
