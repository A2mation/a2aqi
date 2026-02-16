import { describe, it, expect, vi, beforeEach } from "vitest";
import { HourlyDashboardController } from "@/domains/dashboard/controllers/hourly.controller";
import { HourlyAggregationService } from "@/domains/dashboard/services/hourly-aggregation.service";

vi.mock("@/domains/dashboard/services/hourly-aggregation.service", () => {
    return {
        HourlyAggregationService: {
            getHourly: vi.fn(),
        },
    };
});

describe("HourlyDashboardController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 400 if deviceId is missing", async () => {
        const req = new Request("http://localhost/api/dashboard/hourly?date=2026-02-16");

        const res = await HourlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual({
            error: "deviceId and date are required",
        });
    });

    it("should return 400 if date is missing", async () => {
        const req = new Request("http://localhost/api/dashboard/hourly?deviceId=device123");

        const res = await HourlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual({
            error: "deviceId and date are required",
        });
    });

    it("should return hourly data successfully", async () => {
        const mockResult = [
            {
                hourStart: new Date("2026-02-16T10:00:00.000Z"),
                avgAqi: 50,
                minAqi: 20,
                maxAqi: 80,
            },
        ];

        (HourlyAggregationService.getHourly as any).mockResolvedValue(mockResult);

        const req = new Request(
            "http://localhost/api/dashboard/hourly?deviceId=device123&date=2026-02-16"
        );

        const res = await HourlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(200);

        expect(json.success).toBe(true);
        expect(json.data[0].avgAqi).toBe(50);
        expect(json.data[0].minAqi).toBe(20);
        expect(json.data[0].maxAqi).toBe(80);

        // Date gets serialized
        expect(json.data[0].hourStart).toBe(
            mockResult[0].hourStart.toISOString()
        );
    });


    it("should return 500 if service throws error", async () => {
        (HourlyAggregationService.getHourly as any).mockRejectedValue(
            new Error("Internal Server Error")
        );

        const req = new Request(
            "http://localhost/api/dashboard/hourly?deviceId=device123&date=2026-02-16"
        );

        const res = await HourlyDashboardController(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Internal Server Error");
    });

});
