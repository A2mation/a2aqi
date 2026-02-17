import { describe, it, expect, vi, beforeEach } from "vitest";
import { YearlyDashboardController } from "@/domains/dashboard/controllers/yearly.controller";
import { YearlyAggregationService } from "@/domains/dashboard/services/yearly-aggregation.service";

vi.mock("@/domains/dashboard/services/yearly-aggregation.service", () => ({
    YearlyAggregationService: {
        getYearly: vi.fn(),
    },
}));

describe("YearlyDashboardController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 400 if deviceId is missing", async () => {
        const req = new Request("http://localhost/api/dashboard/yearly?year=2026");

        const res = await YearlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual({
            error: "deviceId and year are required",
        });
    });

    it("should return 400 if year is missing", async () => {
        const req = new Request(
            "http://localhost/api/dashboard/yearly?deviceId=device123"
        );

        const res = await YearlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual({
            error: "deviceId and year are required",
        });
    });

    it("should return 400 if year is not a valid number", async () => {
        const req = new Request(
            "http://localhost/api/dashboard/yearly?deviceId=device123&year=abc"
        );

        const res = await YearlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual({
            error: "year must be a valid number",
        });
    });

    it("should return yearly data successfully", async () => {
        const mockResult = [
            {
                monthStart: new Date("2026-02-01T00:00:00.000Z"),
                avgAqi: 55,
                minAqi: 20,
                maxAqi: 100,
            },
        ];

        (YearlyAggregationService.getYearly as any).mockResolvedValue(mockResult);

        const req = new Request(
            "http://localhost/api/dashboard/yearly?deviceId=device123&year=2026"
        );

        const res = await YearlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(200);

        expect(YearlyAggregationService.getYearly).toHaveBeenCalledTimes(1);
        expect(YearlyAggregationService.getYearly).toHaveBeenCalledWith(
            "device123",
            2026
        );

        expect(json.success).toBe(true);

        // Date gets converted to string when returned as JSON
        expect(json.data[0].monthStart).toBe(
            mockResult[0].monthStart.toISOString()
        );

        expect(json.data[0].avgAqi).toBe(55);
        expect(json.data[0].minAqi).toBe(20);
        expect(json.data[0].maxAqi).toBe(100);
    });

    it("should return 500 if service throws error", async () => {
        (YearlyAggregationService.getYearly as any).mockRejectedValue(
            new Error("DB error")
        );

        const req = new Request(
            "http://localhost/api/dashboard/yearly?deviceId=device123&year=2026"
        );

        const res = await YearlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json).toEqual({
            error: "Internal Server Error",
        });
    });
});
