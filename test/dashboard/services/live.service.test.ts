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

    it("should return null if no latest record exists", async () => {
        (SensorReadingRepo.getLatest as any).mockResolvedValue(null);

        const result = await LiveService.getLive("device123");

        expect(SensorReadingRepo.getLatest).toHaveBeenCalledTimes(1);
        expect(SensorReadingRepo.getLatest).toHaveBeenCalledWith("device123");

        expect(result).toBeNull();
    });

    it("should return latest reading with only non-null fields", async () => {
        const mockLatest = {
            measuredAt: new Date("2026-02-19T10:00:00.000Z"),

            aqi: 50,
            pm1: null,
            pm25: 20,
            pm10: null,

            so2: null,
            no2: 15,
            co2: 450,
            co: null,
            o3: null,

            tvoc: 100,
            smoke: null,
            methane: null,
            h2: null,
            ammonia: 5,
            h2s: null,

            noise: 30,
            temperature: 22,
            humidity: null,
        };

        (SensorReadingRepo.getLatest as any).mockResolvedValue(mockLatest);

        const result = await LiveService.getLive("device123");

        expect(SensorReadingRepo.getLatest).toHaveBeenCalledTimes(1);
        expect(SensorReadingRepo.getLatest).toHaveBeenCalledWith("device123");

        expect(result).toEqual({
            measuredAt: mockLatest.measuredAt.toISOString(),

            aqi: 50,
            pm25: 20,

            no2: 15,
            co2: 450,

            tvoc: 100,
            ammonia: 5,

            noise: 30,
            temperature: 22,
        });

        // optional extra checks
        expect(result).not.toHaveProperty("pm1");
        expect(result).not.toHaveProperty("pm10");
        expect(result).not.toHaveProperty("so2");
        expect(result).not.toHaveProperty("humidity");
    });

    it("should throw error if repo throws error", async () => {
        (SensorReadingRepo.getLatest as any).mockRejectedValue(new Error("DB error"));

        await expect(LiveService.getLive("device123")).rejects.toThrow("DB error");
    });
});
