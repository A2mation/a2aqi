import { describe, it, expect, vi, beforeEach } from "vitest";
import { YearlyAggregationService } from "@/domains/dashboard/services/yearly-aggregation.service";
import { YearlyAggregateRepo } from "@/domains/dashboard/repositories/yearly-aggregate.repo";

vi.mock("@/domains/dashboard/repositories/yearly-aggregate.repo", () => ({
    YearlyAggregateRepo: {
        findByYear: vi.fn(),
    },
}));

describe("YearlyAggregationService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return grouped monthly data with averages, min and max", async () => {
        const mockDbData = [
            {
                deviceId: "device123",
                dayStart: new Date("2026-02-01T00:00:00.000Z"),
                count: 10,

                sumAqi: 500,
                minAqi: 20,
                maxAqi: 80,

                sumPm10: 100,
                minPm10: 5,
                maxPm10: 20,

                sumPm25: 200,
                minPm25: 10,
                maxPm25: 40,

                sumTemperature: 300,
                minTemperature: 20,
                maxTemperature: 40,

                sumHumidity: 500,
                minHumidity: 30,
                maxHumidity: 80,
            },
            {
                deviceId: "device123",
                dayStart: new Date("2026-02-02T00:00:00.000Z"),
                count: 20,

                sumAqi: 1000,
                minAqi: 10,
                maxAqi: 100,

                sumPm10: 200,
                minPm10: 3,
                maxPm10: 25,

                sumPm25: 400,
                minPm25: 8,
                maxPm25: 50,

                sumTemperature: 600,
                minTemperature: 18,
                maxTemperature: 42,

                sumHumidity: 700,
                minHumidity: 25,
                maxHumidity: 90,
            },
            {
                deviceId: "device123",
                dayStart: new Date("2026-03-01T00:00:00.000Z"),
                count: 10,

                sumAqi: 200,
                minAqi: 50,
                maxAqi: 90,

                sumPm10: 50,
                minPm10: 2,
                maxPm10: 10,

                sumPm25: 70,
                minPm25: 5,
                maxPm25: 20,

                sumTemperature: 200,
                minTemperature: 15,
                maxTemperature: 35,

                sumHumidity: 300,
                minHumidity: 20,
                maxHumidity: 70,
            },
        ];

        (YearlyAggregateRepo.findByYear as any).mockResolvedValue(mockDbData);

        const result = await YearlyAggregationService.getYearly("device123", 2026);

        expect(YearlyAggregateRepo.findByYear).toHaveBeenCalledTimes(1);
        expect(YearlyAggregateRepo.findByYear).toHaveBeenCalledWith("device123", 2026);

        expect(result).toHaveLength(2);

        const feb = result.find(
            (r) => new Date(r.monthStart).toISOString() === "2026-02-01T00:00:00.000Z"
        );

        const mar = result.find(
            (r) => new Date(r.monthStart).toISOString() === "2026-03-01T00:00:00.000Z"
        );

        expect(feb).toBeDefined();
        expect(mar).toBeDefined();

        // FEB 2026
        expect(feb).toMatchObject({
            count: 30,

            avgAqi: 1500 / 30,
            minAqi: 10,
            maxAqi: 100,

            avgPm10: 300 / 30,
            minPm10: 3,
            maxPm10: 25,

            avgPm25: 600 / 30,
            minPm25: 8,
            maxPm25: 50,

            avgTemperature: 900 / 30,
            minTemperature: 18,
            maxTemperature: 42,

            avgHumidity: 1200 / 30,
            minHumidity: 25,
            maxHumidity: 90,
        });

        expect(new Date(feb!.monthStart).toISOString()).toBe("2026-02-01T00:00:00.000Z");

        // MAR 2026
        expect(mar).toMatchObject({
            count: 10,

            avgAqi: 200 / 10,
            minAqi: 50,
            maxAqi: 90,

            avgPm10: 50 / 10,
            minPm10: 2,
            maxPm10: 10,

            avgPm25: 70 / 10,
            minPm25: 5,
            maxPm25: 20,

            avgTemperature: 200 / 10,
            minTemperature: 15,
            maxTemperature: 35,

            avgHumidity: 300 / 10,
            minHumidity: 20,
            maxHumidity: 70,
        });

        expect(new Date(mar!.monthStart).toISOString()).toBe("2026-03-01T00:00:00.000Z");
    });

    it("should return empty array if no records exist", async () => {
        (YearlyAggregateRepo.findByYear as any).mockResolvedValue([]);

        const result = await YearlyAggregationService.getYearly("device123", 2026);

        expect(result).toEqual([]);
    });

    it("should throw error if repo throws error", async () => {
        (YearlyAggregateRepo.findByYear as any).mockRejectedValue(new Error("DB error"));

        await expect(
            YearlyAggregationService.getYearly("device123", 2026)
        ).rejects.toThrow("DB error");
    });
});
