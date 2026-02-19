import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardOverviewService } from "@/domains/dashboard/services/dashboard-overview.service";
import { SensorReadingRepo } from "@/domains/dashboard/repositories/sensor-reading.repo";
import { DailyAggregateRepo } from "@/domains/dashboard/repositories/daily-aggregate.repo";
import { safeAvg } from "@/domains/dashboard/utils/average.util";
import { getAqiLevel } from "@/domains/dashboard/utils/aqi.util";

vi.mock("@/domains/dashboard/repositories/sensor-reading.repo", () => ({
    SensorReadingRepo: {
        getLatest: vi.fn(),
    },
}));

vi.mock("@/domains/dashboard/repositories/daily-aggregate.repo", () => ({
    DailyAggregateRepo: {
        findByDay: vi.fn(),
    },
}));

vi.mock("@/domains/dashboard/utils/average.util", async () => {
    const actual = await vi.importActual<any>(
        "@/domains/dashboard/utils/average.util"
    );

    return {
        ...actual,
        safeAvg: vi.fn(),
    };
});

vi.mock("@/domains/dashboard/utils/aqi.util", () => ({
    getAqiLevel: vi.fn(),
}));

describe("DashboardOverviewService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return empty object if no data exists (null fields removed)", async () => {
        (SensorReadingRepo.getLatest as any).mockResolvedValue(null);
        (DailyAggregateRepo.findByDay as any).mockResolvedValue(null);

        const result = await DashboardOverviewService.getOverview(
            "device123",
            "2026-02-16"
        );

        // discardNullFieldsDeep removes latest:null and daily:null
        expect(result).toEqual({});
    });

    it("should return latest sensor reading data", async () => {
        (SensorReadingRepo.getLatest as any).mockResolvedValue({
            measuredAt: new Date("2026-02-16T10:00:00.000Z"),
            aqi: 120,
            pm25: 40,
            pm10: 60,
            pm1: 10,
            so2: 1,
            no2: 2,
            co2: 300,
            co: 0.2,
            o3: 5,
            tvoc: 12,
            smoke: 0,
            methane: 0,
            h2: 0,
            ammonia: 0,
            h2s: 0,
            noise: 50,
            temperature: 30,
            humidity: 60,
        });

        (DailyAggregateRepo.findByDay as any).mockResolvedValue(null);

        const result = await DashboardOverviewService.getOverview(
            "device123",
            "2026-02-16"
        );

        expect(result.latest).toEqual({
            measuredAt: "2026-02-16T10:00:00.000Z",
            aqi: 120,
            pm25: 40,
            pm10: 60,
            pm1: 10,
            so2: 1,
            no2: 2,
            co2: 300,
            co: 0.2,
            o3: 5,
            tvoc: 12,
            smoke: 0,
            methane: 0,
            h2: 0,
            ammonia: 0,
            h2s: 0,
            noise: 50,
            temperature: 30,
            humidity: 60,
        });

        // daily:null removed entirely
        expect(result.daily).toBeUndefined();
    });

    it("should return daily aggregate formatted response", async () => {
        (SensorReadingRepo.getLatest as any).mockResolvedValue(null);

        const mockDaily = {
            dayStart: new Date("2026-02-16T00:00:00.000Z"),
            count: 10,

            sumAqi: 500,
            minAqi: 20,
            maxAqi: 80,

            sumPm10: 100,
            minPm10: 5,
            maxPm10: 30,

            sumPm25: 200,
            minPm25: 10,
            maxPm25: 50,

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

            sumTemperature: 300,
            minTemperature: 20,
            maxTemperature: 40,

            sumHumidity: 500,
            minHumidity: 40,
            maxHumidity: 80,
        };

        (DailyAggregateRepo.findByDay as any).mockResolvedValue(mockDaily);

        (safeAvg as any).mockImplementation((sum: number, count: number) =>
            sum != null ? sum / count : null
        );

        (getAqiLevel as any).mockReturnValue("MODERATE");

        const result = await DashboardOverviewService.getOverview(
            "device123",
            "2026-02-16"
        );

        expect(result.latest).toBeUndefined();

        expect(result.daily).toMatchObject({
            dayStart: "2026-02-16T00:00:00.000Z",
            count: 10,

            avgAqi: 50,
            minAqi: 20,
            maxAqi: 80,

            avgPm10: 10,
            minPm10: 5,
            maxPm10: 30,

            avgPm25: 20,
            minPm25: 10,
            maxPm25: 50,

            avgTemperature: 30,
            minTemperature: 20,
            maxTemperature: 40,

            avgHumidity: 50,
            minHumidity: 40,
            maxHumidity: 80,

            aqiLevel: "MODERATE",
        });

        // null ones should be removed
        expect(result.daily).not.toHaveProperty("avgSo2");
        expect(result.daily).not.toHaveProperty("avgNo2");
        expect(result.daily).not.toHaveProperty("avgCo2");
    });

    it("should throw error if repo fails", async () => {
        (SensorReadingRepo.getLatest as any).mockRejectedValue(new Error("DB error"));

        await expect(
            DashboardOverviewService.getOverview("device123", "2026-02-16")
        ).rejects.toThrow("DB error");
    });
});
