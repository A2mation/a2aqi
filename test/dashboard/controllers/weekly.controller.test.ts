import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/domains/dashboard/services/weekly-aggregation.service", () => ({
    WeeklyAggregationService: {
        getWeekly: vi.fn(),
    },
}));

import { WeeklyDashboardController } from "@/domains/dashboard/controllers/weekly.controller";
import { WeeklyAggregationService } from "@/domains/dashboard/services/weekly-aggregation.service";

describe("WeeklyDashboardController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 400 if deviceId is missing", async () => {
        const req = new Request("http://localhost/api/dashboard/weekly");

        const res = await WeeklyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("deviceId is required");
    });

    it("should fallback to today's date if date is missing", async () => {
        const mockResult = [
            {
                dayStart: new Date("2026-02-15T00:00:00.000Z"),
                avgAqi: 50,
            },
        ];

        (WeeklyAggregationService.getWeekly as any).mockResolvedValue(mockResult);

        const req = new Request(
            "http://localhost/api/dashboard/weekly?deviceId=device123"
        );

        const res = await WeeklyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);

        expect(WeeklyAggregationService.getWeekly).toHaveBeenCalledTimes(1);

        const callArgs = (WeeklyAggregationService.getWeekly as any).mock.calls[0];

        expect(callArgs[0]).toBe("device123"); // deviceId
        expect(typeof callArgs[1]).toBe("string"); // dateStr
    });

    it("should return weekly data successfully when date is provided", async () => {
        const mockResult = [
            {
                dayStart: new Date("2026-02-15T00:00:00.000Z"),
                avgAqi: 50,
            },
        ];

        (WeeklyAggregationService.getWeekly as any).mockResolvedValue(mockResult);

        const req = new Request(
            "http://localhost/api/dashboard/weekly?deviceId=device123&date=2026-02-18"
        );

        const res = await WeeklyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(200);

        expect(WeeklyAggregationService.getWeekly).toHaveBeenCalledTimes(1);
        expect(WeeklyAggregationService.getWeekly).toHaveBeenCalledWith(
            "device123",
            "2026-02-18"
        );

        expect(json.success).toBe(true);

        // Date gets serialized into string
        expect(json.data[0].dayStart).toBe(mockResult[0].dayStart.toISOString());
        expect(json.data[0].avgAqi).toBe(50);
    });

    it("should return 500 if service throws error", async () => {
        (WeeklyAggregationService.getWeekly as any).mockRejectedValue(
            new Error("DB error")
        );

        const req = new Request(
            "http://localhost/api/dashboard/weekly?deviceId=device123&date=2026-02-18"
        );

        const res = await WeeklyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Internal Server Error");
    });
});
