import { describe, it, expect, vi, beforeEach } from "vitest";
import { DailyDashboardController } from "@/domains/dashboard/controllers/daily.controller";
import { DailyAggregationService } from "@/domains/dashboard/services/daily-aggregation.service";

vi.mock("@/domains/dashboard/services/daily-aggregation.service", () => ({
    DailyAggregationService: {
        getDaily: vi.fn(),
    },
}));

describe("DailyDashboardController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 400 if deviceId is missing", async () => {
        const req = new Request(
            "http://localhost/api/dashboard/daily?date=2026-02-16"
        );

        const res = await DailyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual({
            error: "deviceId and date are required",
        });
    });

    it("should return 400 if date is missing", async () => {
        const req = new Request(
            "http://localhost/api/dashboard/daily?deviceId=device123"
        );

        const res = await DailyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual({
            error: "deviceId and date are required",
        });
    });

    it("should return daily data successfully", async () => {
        const mockResult = {
            dayStart: new Date("2026-02-16T00:00:00.000Z"),
            avgAqi: 50,
            minAqi: 20,
            maxAqi: 80,
        };

        (DailyAggregationService.getDaily as any).mockResolvedValue(mockResult);

        const req = new Request(
            "http://localhost/api/dashboard/daily?deviceId=device123&date=2026-02-16T00:00:00.000Z"
        );

        const res = await DailyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(200);

        expect(DailyAggregationService.getDaily).toHaveBeenCalledTimes(1);
        expect(DailyAggregationService.getDaily).toHaveBeenCalledWith(
            "device123",
            "2026-02-16T00:00:00.000Z"
        );

        expect(json.success).toBe(true);

        // Date will serialize into string
        expect(json.data.dayStart).toBe(mockResult.dayStart.toISOString());
        expect(json.data.avgAqi).toBe(50);
        expect(json.data.minAqi).toBe(20);
        expect(json.data.maxAqi).toBe(80);
    });

    it("should return null data if service returns null", async () => {
        (DailyAggregationService.getDaily as any).mockResolvedValue(null);

        const req = new Request(
            "http://localhost/api/dashboard/daily?deviceId=device123&date=2026-02-16T00:00:00.000Z"
        );

        const res = await DailyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json).toEqual({
            success: true,
            data: null,
        });
    });

    it("should return 500 if service throws error", async () => {
        (DailyAggregationService.getDaily as any).mockRejectedValue(
            new Error("DB error")
        );

        const req = new Request(
            "http://localhost/api/dashboard/daily?deviceId=device123&date=2026-02-16T00:00:00.000Z"
        );

        const res = await DailyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json).toEqual({
            error: "Internal Server Error",
        });
    });
});
