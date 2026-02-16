import { describe, it, expect, vi, beforeEach } from "vitest";
import { DailyAggregationService } from "@/domains/dashboard/services/daily-aggregation.service";
import { DailyAggregateRepo } from "@/domains/dashboard/repositories/daily-aggregate.repo";

vi.mock("@/domains/dashboard/repositories/daily-aggregate.repo", () => ({
    DailyAggregateRepo: {
        findByDay: vi.fn(),
    },
}));

describe("DailyAggregationService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return null if no record found", async () => {
        (DailyAggregateRepo.findByDay as any).mockResolvedValue(null);

        const result = await DailyAggregationService.getDaily(
            "device123",
            "2026-02-16T00:00:00.000Z"
        );

        expect(DailyAggregateRepo.findByDay).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
    });

    it("should return formatted daily aggregate with averages", async () => {
        const mockRecord = {
            dayStart: new Date("2026-02-16T00:00:00.000Z"),
            count: 10,

            sumAqi: 500,
            minAqi: 20,
            maxAqi: 80,

            sumPm10: 100,
            minPm10: 5,
            maxPm10: 20,

            sumPm25: 200,
            minPm25: 10,
            maxPm25: 30,

            sumTemperature: 300,
            minTemperature: 25,
            maxTemperature: 35,

            sumHumidity: 500,
            minHumidity: 40,
            maxHumidity: 60,

            // all other fields missing
            sumSo2: null,
            minSo2: null,
            maxSo2: null,

            sumNo2: null,
            minNo2: null,
            maxNo2: null,

            sumCo2: null,
            minCo2: null,
            maxCo2: null,

            sumCo: null,
            minCo: null,
            maxCo: null,

            sumO3: null,
            minO3: null,
            maxO3: null,

            sumNoise: null,
            minNoise: null,
            maxNoise: null,

            sumPM1: null,
            minPM1: null,
            maxPM1: null,

            sumTvoc: null,
            minTvoc: null,
            maxTvoc: null,

            sumSmoke: null,
            minSmoke: null,
            maxSmoke: null,

            sumMethane: null,
            minMethane: null,
            maxMethane: null,

            sumH2: null,
            minH2: null,
            maxH2: null,

            sumAmmonia: null,
            minAmmonia: null,
            maxAmmonia: null,

            sumH2s: null,
            minH2s: null,
            maxH2s: null,
        };

        (DailyAggregateRepo.findByDay as any).mockResolvedValue(mockRecord);

        const result = await DailyAggregationService.getDaily(
            "device123",
            "2026-02-16T00:00:00.000Z"
        );

        expect(DailyAggregateRepo.findByDay).toHaveBeenCalledTimes(1);
        expect(DailyAggregateRepo.findByDay).toHaveBeenCalledWith(
            "device123",
            "2026-02-16T00:00:00.000Z"
        );

        expect(result).toMatchObject({
            dayStart: mockRecord.dayStart,
            count: 10,

            avgAqi: 50,
            minAqi: 20,
            maxAqi: 80,

            avgPm10: 10,
            minPm10: 5,
            maxPm10: 20,

            avgPm25: 20,
            minPm25: 10,
            maxPm25: 30,

            avgTemperature: 30,
            minTemperature: 25,
            maxTemperature: 35,

            avgHumidity: 50,
            minHumidity: 40,
            maxHumidity: 60,
        });

        // check null fields are returned correctly
        expect(result?.avgSo2).toBeNull();
        expect(result?.minSo2).toBeNull();
        expect(result?.maxSo2).toBeNull();
    });

    it("should return null min/max if values are missing", async () => {
        const mockRecord = {
            dayStart: new Date("2026-02-16T00:00:00.000Z"),
            count: 10,
            sumAqi: 500,
            minAqi: undefined,
            maxAqi: undefined,
        };

        (DailyAggregateRepo.findByDay as any).mockResolvedValue(mockRecord);

        const result = await DailyAggregationService.getDaily(
            "device123",
            "2026-02-16T00:00:00.000Z"
        );

        expect(result?.avgAqi).toBe(50);
        expect(result?.minAqi).toBeNull();
        expect(result?.maxAqi).toBeNull();
    });

    it("should throw error if repo fails", async () => {
        (DailyAggregateRepo.findByDay as any).mockRejectedValue(
            new Error("DB error")
        );

        await expect(
            DailyAggregationService.getDaily("device123", "2026-02-16T00:00:00.000Z")
        ).rejects.toThrow("DB error");
    });
});
