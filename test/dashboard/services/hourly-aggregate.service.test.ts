import { describe, it, expect, vi, beforeEach } from "vitest";
import { HourlyAggregationService } from "@/domains/dashboard/services/hourly-aggregation.service";
import { HourlyAggregateRepo } from "@/domains/dashboard/repositories/hourly-aggregate.repo";

vi.mock("@/domains/dashboard/repositories/hourly-aggregate.repo", () => ({
    HourlyAggregateRepo: {
        findByDate: vi.fn(),
    },
}));

describe("HourlyAggregationService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should remove null fields when sums are missing", async () => {
        const mockDbData = [
            {
                hourStart: new Date("2026-02-16T10:00:00.000Z"),
                count: 10,
                sumAqi: null,
                minAqi: null,
                maxAqi: null,
                sumPm25: null,
                sumPm10: null,
                sumTemperature: null,
                sumHumidity: null,
            },
        ];

        (HourlyAggregateRepo.findByDate as any).mockResolvedValue(mockDbData);

        const result = await HourlyAggregationService.getHourly(
            "device123",
            "2026-02-16"
        );

        expect(HourlyAggregateRepo.findByDate).toHaveBeenCalledTimes(1);
        expect(HourlyAggregateRepo.findByDate).toHaveBeenCalledWith(
            "device123",
            "2026-02-16"
        );

        expect(result).toHaveLength(1);

        // hourStart may be converted into string depending on discardNullFields implementation
        expect(new Date(result[0].hourStart).toISOString()).toBe(
            "2026-02-16T10:00:00.000Z"
        );

        // only count + hourStart should remain
        expect(result[0]).toMatchObject({
            count: 10,
        });

        // removed null fields
        expect(result[0]).not.toHaveProperty("avgAqi");
        expect(result[0]).not.toHaveProperty("minAqi");
        expect(result[0]).not.toHaveProperty("maxAqi");

        expect(result[0]).not.toHaveProperty("avgPm10");
        expect(result[0]).not.toHaveProperty("avgPm25");

        expect(result[0]).not.toHaveProperty("avgTemperature");
        expect(result[0]).not.toHaveProperty("avgHumidity");
    });

    it("should calculate averages when sums exist", async () => {
        const mockDbData = [
            {
                hourStart: new Date("2026-02-16T10:00:00.000Z"),
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
        ];

        (HourlyAggregateRepo.findByDate as any).mockResolvedValue(mockDbData);

        const result = await HourlyAggregationService.getHourly(
            "device123",
            "2026-02-16"
        );

        expect(result).toHaveLength(1);

        expect(result[0]).toMatchObject({
            count: 10,

            avgAqi: 500 / 10,
            minAqi: 20,
            maxAqi: 80,

            avgPm10: 100 / 10,
            minPm10: 5,
            maxPm10: 20,

            avgPm25: 200 / 10,
            minPm25: 10,
            maxPm25: 40,

            avgTemperature: 300 / 10,
            minTemperature: 20,
            maxTemperature: 40,

            avgHumidity: 500 / 10,
            minHumidity: 30,
            maxHumidity: 80,
        });

        expect(new Date(result[0].hourStart).toISOString()).toBe(
            "2026-02-16T10:00:00.000Z"
        );
    });

    it("should throw error if repository fails", async () => {
        (HourlyAggregateRepo.findByDate as any).mockRejectedValue(
            new Error("DB error")
        );

        await expect(
            HourlyAggregationService.getHourly("device123", "2026-02-16")
        ).rejects.toThrow("DB error");
    });
});
