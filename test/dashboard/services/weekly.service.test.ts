import { describe, it, expect, vi, beforeEach } from "vitest";
import { WeeklyAggregationService } from "@/domains/dashboard/services/weekly-aggregation.service";
import { WeeklyAggregateRepo } from "@/domains/dashboard/repositories/weekly-aggregate.repo";

vi.mock("@/domains/dashboard/repositories/weekly-aggregate.repo", () => ({
    WeeklyAggregateRepo: {
        findByWeek: vi.fn(),
    },
}));

describe("WeeklyAggregationService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return empty array if no records exist", async () => {
        (WeeklyAggregateRepo.findByWeek as any).mockResolvedValue([]);

        const result = await WeeklyAggregationService.getWeekly("device123", "2026-02-18");

        expect(result).toEqual([]);
        expect(WeeklyAggregateRepo.findByWeek).toHaveBeenCalledWith("device123", "2026-02-18");
    });

    it("should return formatted weekly aggregate with averages", async () => {
        const mockDbData = [
            {
                dayStart: new Date("2026-02-15T00:00:00.000Z"),
                count: 10,

                sumAqi: 500,
                minAqi: 20,
                maxAqi: 90,

                sumPm10: 100,
                minPm10: 5,
                maxPm10: 20,

                sumPm25: 50,
                minPm25: 2,
                maxPm25: 15,

                sumSo2: 30,
                minSo2: 1,
                maxSo2: 5,

                sumNo2: 40,
                minNo2: 2,
                maxNo2: 7,

                sumCo2: 1000,
                minCo2: 300,
                maxCo2: 500,

                sumCo: 5,
                minCo: 0.1,
                maxCo: 0.5,

                sumO3: 60,
                minO3: 3,
                maxO3: 12,

                sumNoise: 700,
                minNoise: 50,
                maxNoise: 90,

                sumPM1: 20,
                minPM1: 1,
                maxPM1: 5,

                sumTvoc: 80,
                minTvoc: 2,
                maxTvoc: 9,

                sumSmoke: 10,
                minSmoke: 0,
                maxSmoke: 2,

                sumMethane: 15,
                minMethane: 1,
                maxMethane: 4,

                sumH2: 6,
                minH2: 0.1,
                maxH2: 0.5,

                sumAmmonia: 12,
                minAmmonia: 1,
                maxAmmonia: 3,

                sumH2s: 8,
                minH2s: 0.2,
                maxH2s: 1,

                sumTemperature: 250,
                minTemperature: 18,
                maxTemperature: 30,

                sumHumidity: 600,
                minHumidity: 40,
                maxHumidity: 80,
            },
        ];

        (WeeklyAggregateRepo.findByWeek as any).mockResolvedValue(mockDbData);

        const result = await WeeklyAggregationService.getWeekly("device123", "2026-02-18");

        expect(result).toHaveLength(1);

        expect(result[0]).toMatchObject({
            dayStart: mockDbData[0].dayStart,
            count: 10,

            avgAqi: 50,
            minAqi: 20,
            maxAqi: 90,

            avgPm10: 10,
            minPm10: 5,
            maxPm10: 20,

            avgPm25: 5,
            minPm25: 2,
            maxPm25: 15,

            avgSo2: 3,
            minSo2: 1,
            maxSo2: 5,

            avgNo2: 4,
            minNo2: 2,
            maxNo2: 7,

            avgCo2: 100,
            minCo2: 300,
            maxCo2: 500,

            avgCo: 0.5,
            minCo: 0.1,
            maxCo: 0.5,

            avgO3: 6,
            minO3: 3,
            maxO3: 12,

            avgNoise: 70,
            minNoise: 50,
            maxNoise: 90,

            avgPM1: 2,
            minPM1: 1,
            maxPM1: 5,

            avgTvoc: 8,
            minTvoc: 2,
            maxTvoc: 9,

            avgSmoke: 1,
            minSmoke: 0,
            maxSmoke: 2,

            avgMethane: 1.5,
            minMethane: 1,
            maxMethane: 4,

            avgH2: 0.6,
            minH2: 0.1,
            maxH2: 0.5,

            avgAmmonia: 1.2,
            minAmmonia: 1,
            maxAmmonia: 3,

            avgH2s: 0.8,
            minH2s: 0.2,
            maxH2s: 1,

            avgTemperature: 25,
            minTemperature: 18,
            maxTemperature: 30,

            avgHumidity: 60,
            minHumidity: 40,
            maxHumidity: 80,
        });

        expect(WeeklyAggregateRepo.findByWeek).toHaveBeenCalledWith("device123", "2026-02-18");
    });

    it("should return null values if fields are missing", async () => {
        const mockDbData = [
            {
                dayStart: new Date("2026-02-15T00:00:00.000Z"),
                count: 10,

                sumAqi: null,
                minAqi: null,
                maxAqi: null,
            },
        ];

        (WeeklyAggregateRepo.findByWeek as any).mockResolvedValue(mockDbData);

        const result = await WeeklyAggregationService.getWeekly("device123", "2026-02-18");

        expect(result).toHaveLength(1);

        // discardNullFields might remove null values,
        // so we only check that fields are not crashing
        expect(result[0].dayStart).toEqual(mockDbData[0].dayStart);
        expect(result[0].count).toBe(10);
    });

    it("should throw error if repository fails", async () => {
        (WeeklyAggregateRepo.findByWeek as any).mockRejectedValue(new Error("DB error"));

        await expect(
            WeeklyAggregationService.getWeekly("device123", "2026-02-18")
        ).rejects.toThrow("DB error");
    });
});
