import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

import { MonthlyAggregateRepo } from "@/domains/dashboard/repositories/monthly-aggregate.repo";

describe("MonthlyAggregateRepo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return daily aggregates for given month", async () => {
        const mockData = [
            {
                id: "1",
                deviceId: "device123",
                dayStart: new Date("2026-02-01T00:00:00.000Z"),
                count: 10,
                sumAqi: 500,
                minAqi: 20,
                maxAqi: 80,
            },
        ];

        (prismaMock.dailyAggregateReading.findMany as any).mockResolvedValue(mockData);

        const result = await MonthlyAggregateRepo.findByMonth("device123", 2026, 2);

        expect(prismaMock.dailyAggregateReading.findMany).toHaveBeenCalledTimes(1);

        expect(prismaMock.dailyAggregateReading.findMany).toHaveBeenCalledWith({
            where: {
                deviceId: "device123",
                dayStart: {
                    gte: new Date(Date.UTC(2026, 1, 1)),
                    lt: new Date(Date.UTC(2026, 2, 1)),
                },
            },
            orderBy: { dayStart: "asc" },
        });

        expect(result).toEqual(mockData);
    });

    it("should return empty array if no records found", async () => {
        (prismaMock.dailyAggregateReading.findMany as any).mockResolvedValue([]);

        const result = await MonthlyAggregateRepo.findByMonth("device123", 2026, 2);

        expect(result).toEqual([]);
    });

    it("should throw error if prisma fails", async () => {
        (prismaMock.dailyAggregateReading.findMany as any).mockRejectedValue(
            new Error("DB error")
        );

        await expect(
            MonthlyAggregateRepo.findByMonth("device123", 2026, 2)
        ).rejects.toThrow("DB error");
    });
});
