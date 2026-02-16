import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

import { HourlyAggregateRepo } from "@/domains/dashboard/repositories/hourly-aggregate.repo";

describe("HourlyAggregateRepo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return hourly aggregates for the given date", async () => {
        const mockData = [
            {
                id: "1",
                deviceId: "device123",
                hourStart: new Date("2026-02-16T10:00:00.000Z"),
                count: 20,
                sumAqi: 400,
                minAqi: 10,
                maxAqi: 50,
                createdAt: new Date(),
            },
        ];

        (prismaMock.hourlyAggregateReading.findMany as any).mockResolvedValue(mockData);

        const result = await HourlyAggregateRepo.findByDate(
            "device123",
            "2026-02-16"
        );

        expect(prismaMock.hourlyAggregateReading.findMany).toHaveBeenCalledTimes(1);

        expect(prismaMock.hourlyAggregateReading.findMany).toHaveBeenCalledWith({
            where: {
                deviceId: "device123",
                hourStart: {
                    gte: expect.any(Date),
                    lt: expect.any(Date),
                },
            },
            orderBy: { hourStart: "asc" },
        });

        expect(result).toEqual(mockData);
    });

    it("should return empty array if no hourly records exist", async () => {
        (prismaMock.hourlyAggregateReading.findMany as any).mockResolvedValue([]);

        const result = await HourlyAggregateRepo.findByDate(
            "device123",
            "2026-02-16"
        );

        expect(result).toEqual([]);
    });

    it("should throw error if prisma query fails", async () => {
        (prismaMock.hourlyAggregateReading.findMany as any).mockRejectedValue(
            new Error("DB error")
        );

        await expect(
            HourlyAggregateRepo.findByDate("device123", "2026-02-16")
        ).rejects.toThrow("DB error");
    });
});
