import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/domains/dashboard/repositories/monthly-aggregate.repo", () => ({
    MonthlyAggregateRepo: {
        findByMonth: vi.fn(),
    },
}));

import { MonthlyAggregationService } from "@/domains/dashboard/services/monthly-aggregation.service";
import { MonthlyAggregateRepo } from "@/domains/dashboard/repositories/monthly-aggregate.repo";

describe("MonthlyAggregationService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return formatted monthly daily aggregates", async () => {
        const mockDbData = [
            {
                dayStart: new Date("2026-02-01T00:00:00.000Z"),
                count: 10,
                sumAqi: 500,
                minAqi: 20,
                maxAqi: 80,
                sumPm25: 200,
                sumPm10: 100,
                sumTemperature: 300,
                sumHumidity: 500,
            },
        ];

        (MonthlyAggregateRepo.findByMonth as any).mockResolvedValue(mockDbData);

        const result = await MonthlyAggregationService.getMonthly("device123", 2026, 2);

        expect(MonthlyAggregateRepo.findByMonth).toHaveBeenCalledTimes(1);
        expect(MonthlyAggregateRepo.findByMonth).toHaveBeenCalledWith("device123", 2026, 2);

        expect(result).toMatchObject([
            {
                dayStart: mockDbData[0].dayStart,
                count: 10,
                avgAqi: 50,
                minAqi: 20,
                maxAqi: 80,
                avgPm25: 20,
                avgPm10: 10,
                avgTemperature: 30,
                avgHumidity: 50,
            },
        ]);
    });

    it("should return empty array if repo returns empty array", async () => {
        (MonthlyAggregateRepo.findByMonth as any).mockResolvedValue([]);

        const result = await MonthlyAggregationService.getMonthly("device123", 2026, 2);

        expect(result).toEqual([]);
    });

    it("should throw error if repo fails", async () => {
        (MonthlyAggregateRepo.findByMonth as any).mockRejectedValue(
            new Error("DB error")
        );

        await expect(
            MonthlyAggregationService.getMonthly("device123", 2026, 2)
        ).rejects.toThrow("DB error");
    });
});
