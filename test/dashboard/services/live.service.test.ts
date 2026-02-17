import { describe, it, expect, vi, beforeEach } from "vitest";
import { LiveService } from "@/domains/dashboard/services/live.service";
import { SensorReadingRepo } from "@/domains/dashboard/repositories/sensor-reading.repo";

vi.mock("@/domains/dashboard/repositories/sensor-reading.repo", () => ({
    SensorReadingRepo: {
        getLatest: vi.fn(),
    },
}));

describe("LiveService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return null if no latest reading exists", async () => {
        (SensorReadingRepo.getLatest as any).mockResolvedValue(null);

        const result = await LiveService.getLive("device123");

        expect(SensorReadingRepo.getLatest).toHaveBeenCalledTimes(1);
        expect(SensorReadingRepo.getLatest).toHaveBeenCalledWith("device123");

        expect(result).toBeNull();
    });

    it("should return live formatted data when latest reading exists", async () => {
        const mockLatest = {
            measuredAt: new Date("2026-02-16T10:00:00.000Z"),

            aqi: 100,
            pm1: 5,
            pm25: 20,
            pm10: 40,

            so2: 2,
            no2: 5,
            co2: 450,
            co: 0.2,
            o3: 12,

            tvoc: 0.4,
            smoke: 0.1,
            methane: 0.05,
            h2: 0.01,
            ammonia: 0.02,
            h2s: 0.005,

            noise: 65,
            temperature: 30,
            humidity: 60,
        };

        (SensorReadingRepo.getLatest as any).mockResolvedValue(mockLatest);

        const result = await LiveService.getLive("device123");

        expect(SensorReadingRepo.getLatest).toHaveBeenCalledTimes(1);
        expect(SensorReadingRepo.getLatest).toHaveBeenCalledWith("device123");

        expect(result).toEqual({
            measuredAt: mockLatest.measuredAt,

            aqi: 100,
            pm1: 5,
            pm25: 20,
            pm10: 40,

            so2: 2,
            no2: 5,
            co2: 450,
            co: 0.2,
            o3: 12,

            tvoc: 0.4,
            smoke: 0.1,
            methane: 0.05,
            h2: 0.01,
            ammonia: 0.02,
            h2s: 0.005,

            noise: 65,
            temperature: 30,
            humidity: 60,
        });
    });

    it("should return null values if fields are missing", async () => {
        const mockLatest = {
            measuredAt: new Date("2026-02-16T10:00:00.000Z"),
            aqi: null,
            pm1: null,
            pm25: null,
            pm10: null,
            so2: null,
            no2: null,
            co2: null,
            co: null,
            o3: null,
            tvoc: null,
            smoke: null,
            methane: null,
            h2: null,
            ammonia: null,
            h2s: null,
            noise: null,
            temperature: null,
            humidity: null,
        };

        (SensorReadingRepo.getLatest as any).mockResolvedValue(mockLatest);

        const result = await LiveService.getLive("device123");

        expect(result).toEqual({
            measuredAt: mockLatest.measuredAt,

            aqi: null,
            pm1: null,
            pm25: null,
            pm10: null,

            so2: null,
            no2: null,
            co2: null,
            co: null,
            o3: null,

            tvoc: null,
            smoke: null,
            methane: null,
            h2: null,
            ammonia: null,
            h2s: null,

            noise: null,
            temperature: null,
            humidity: null,
        });
    });

    it("should throw error if repo fails", async () => {
        (SensorReadingRepo.getLatest as any).mockRejectedValue(new Error("DB error"));

        await expect(LiveService.getLive("device123")).rejects.toThrow("DB error");
    });
});
