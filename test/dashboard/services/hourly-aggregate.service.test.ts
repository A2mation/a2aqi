import { describe, it, expect, vi, beforeEach } from "vitest";
import { HourlyAggregationService } from "@/domains/dashboard/services/hourly-aggregation.service";
import { HourlyAggregateRepo } from "@/domains/dashboard/repositories/hourly-aggregate.repo";

vi.mock("@/domains/dashboard/repositories/hourly-aggregate.repo", () => {
    return {
        HourlyAggregateRepo: {
            findByDate: vi.fn(),
        },
    };
});

describe("HourlyAggregationService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return formatted hourly data with averages", async () => {
        const mockDbData = [
            {
                hourStart: new Date("2026-02-16T10:00:00.000Z"),
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

        expect(result).toEqual([
            {
                hourStart: mockDbData[0].hourStart,
                avgAqi: 50,
                minAqi: 20,
                maxAqi: 80,
                avgPm25: 20,
                avgPm10: 10,
                avgTemp: 30,
                avgHumidity: 50,
            },
        ]);
    });

    it("should return null averages if sum is missing", async () => {
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

        expect(result).toEqual([
            {
                hourStart: mockDbData[0].hourStart,
                avgAqi: null,
                minAqi: null,
                maxAqi: null,
                avgPm25: null,
                avgPm10: null,
                avgTemp: null,
                avgHumidity: null,
            },
        ]);
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
