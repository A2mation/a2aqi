import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/domains/dashboard/services/monthly-aggregation.service", () => ({
    MonthlyAggregationService: {
        getMonthly: vi.fn(),
    },
}));

import { MonthlyDashboardController } from "@/domains/dashboard/controllers/monthly.controller";
import { MonthlyAggregationService } from "@/domains/dashboard/services/monthly-aggregation.service";

describe("MonthlyDashboardController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 400 if deviceId is missing", async () => {
        const req = new Request(
            "http://localhost/api/dashboard/monthly?year=2026&month=2"
        );

        const res = await MonthlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("deviceId is required");
    });

    it("should return 400 if year and month are invalid numbers", async () => {
        const req = new Request(
            "http://localhost/api/dashboard/monthly?deviceId=device123&year=abc&month=xyz"
        );

        const res = await MonthlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("year and month must be valid numbers");
    });

    it("should fallback to current year/month if year and month are missing", async () => {
        const mockResult = [
            {
                dayStart: new Date("2026-02-01T00:00:00.000Z"),
                avgAqi: 50,
                minAqi: 20,
                maxAqi: 80,
            },
        ];

        (MonthlyAggregationService.getMonthly as any).mockResolvedValue(mockResult);

        const req = new Request(
            "http://localhost/api/user/dashboard/monthly?deviceId=device123"
        );

        const res = await MonthlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data[0].dayStart).toBe(mockResult[0].dayStart.toISOString());

        expect(MonthlyAggregationService.getMonthly).toHaveBeenCalledTimes(1);

        // just verify it was called with deviceId and numbers
        const callArgs = (MonthlyAggregationService.getMonthly as any).mock.calls[0];

        expect(callArgs[0]).toBe("device123");
        expect(typeof callArgs[1]).toBe("number");
        expect(typeof callArgs[2]).toBe("number");
    });

    it("should return monthly data successfully", async () => {
        const mockResult = [
            {
                dayStart: new Date("2026-02-01T00:00:00.000Z"),
                avgAqi: 50,
                minAqi: 20,
                maxAqi: 80,
            },
        ];

        (MonthlyAggregationService.getMonthly as any).mockResolvedValue(mockResult);

        const req = new Request(
            "http://localhost/api/user/dashboard/monthly?deviceId=device123&year=2026&month=2"
        );

        const res = await MonthlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(200);

        expect(MonthlyAggregationService.getMonthly).toHaveBeenCalledTimes(1);
        expect(MonthlyAggregationService.getMonthly).toHaveBeenCalledWith(
            "device123",
            2026,
            2
        );

        expect(json.success).toBe(true);

        // Date serialized into string
        expect(json.data[0].dayStart).toBe(mockResult[0].dayStart.toISOString());
        expect(json.data[0].avgAqi).toBe(50);
    });

    it("should return 500 if service throws error", async () => {
        (MonthlyAggregationService.getMonthly as any).mockRejectedValue(
            new Error("DB error")
        );

        const req = new Request(
            "http://localhost/api/user/dashboard/monthly?deviceId=device123&year=2026&month=2"
        );

        const res = await MonthlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Internal Server Error");
    });
});
