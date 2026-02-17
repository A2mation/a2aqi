import { describe, it, expect, vi, beforeEach } from "vitest";
import { LiveDashboardController } from "@/domains/dashboard/controllers/live.controller";
import { LiveService } from "@/domains/dashboard/services/live.service";

vi.mock("@/domains/dashboard/services/live.service", () => ({
    LiveService: {
        getLive: vi.fn(),
    },
}));

describe("LiveDashboardController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 400 if deviceId is missing", async () => {
        const req = new Request("http://localhost/api/user/dashboard/live");

        const res = await LiveDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("deviceId is required");
    });

    it("should return 200 with live data", async () => {
        const mockData = {
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

        (LiveService.getLive as any).mockResolvedValue(mockData);

        const req = new Request(
            "http://localhost/api/user/dashboard/live?deviceId=device123"
        );

        const res = await LiveDashboardController(req);
        const json = await res.json();

        expect(LiveService.getLive).toHaveBeenCalledTimes(1);
        expect(LiveService.getLive).toHaveBeenCalledWith("device123");

        expect(res.status).toBe(200);

        expect(json).toEqual({
            success: true,
            data: {
                ...mockData,
                measuredAt: mockData.measuredAt.toISOString(),
            },
        });
    });

    it("should return 200 with null data if no live record exists", async () => {
        (LiveService.getLive as any).mockResolvedValue(null);

        const req = new Request(
            "http://localhost/api/user/dashboard/live?deviceId=device123"
        );

        const res = await LiveDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json).toEqual({
            success: true,
            data: null,
        });
    });

    it("should return 500 if service throws error", async () => {
        (LiveService.getLive as any).mockRejectedValue(new Error("DB error"));

        const req = new Request(
            "http://localhost/api/dashboard/live?deviceId=device123"
        );

        const res = await LiveDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Internal Server Error");
    });
});
