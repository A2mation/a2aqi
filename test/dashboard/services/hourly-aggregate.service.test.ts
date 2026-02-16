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

        expect(result).toMatchObject([
            {
                hourStart: mockDbData[0].hourStart,
                avgAqi: null,
                minAqi: null,
                maxAqi: null,
                avgPm25: null,
                avgPm10: null,
                avgTemperature: null,
                avgHumidity: null,
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

        expect(result).toMatchObject([
            {
                hourStart: mockDbData[0].hourStart,
                avgAqi: null,
                minAqi: null,
                maxAqi: null,
                avgPm25: null,
                avgPm10: null,
                avgTemperature: null,
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
