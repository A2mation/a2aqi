import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardOverviewController } from "@/domains/dashboard/controllers/dashboard.controller";
import { DashboardOverviewService } from "@/domains/dashboard/services/dashboard-overview.service";

vi.mock("@/domains/dashboard/services/dashboard-overview.service", () => ({
    DashboardOverviewService: {
        getOverview: vi.fn(),
    },
}));

describe("DashboardOverviewController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it("should return 400 if deviceId is missing", async () => {
        const req = new Request("http://localhost/api/user/dashboard/overview");

        const res = await DashboardOverviewController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("deviceId is required");
    });

    it("should use today's date if date is not provided", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-02-16T10:00:00.000Z"));

        (DashboardOverviewService.getOverview as any).mockResolvedValue({
            latest: null,
            daily: null,
        });

        const req = new Request(
            "http://localhost/api/user/dashboard/overview?deviceId=device123"
        );

        const res = await DashboardOverviewController(req);
        const json = await res.json();

        expect(DashboardOverviewService.getOverview).toHaveBeenCalledTimes(1);
        expect(DashboardOverviewService.getOverview).toHaveBeenCalledWith(
            "device123",
            "2026-02-16"
        );

        expect(res.status).toBe(200);
        expect(json).toEqual({
            success: true,
            data: {
                latest: null,
                daily: null,
            },
        });
    });

    it("should use provided date if date is passed", async () => {
        (DashboardOverviewService.getOverview as any).mockResolvedValue({
            latest: null,
            daily: null,
        });

        const req = new Request(
            "http://localhost/api/user/dashboard/overview?deviceId=device123&date=2026-02-10"
        );

        const res = await DashboardOverviewController(req);
        const json = await res.json();

        expect(DashboardOverviewService.getOverview).toHaveBeenCalledTimes(1);
        expect(DashboardOverviewService.getOverview).toHaveBeenCalledWith(
            "device123",
            "2026-02-10"
        );

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    it("should return 200 with overview data", async () => {
        const mockData = {
            latest: {
                measuredAt: new Date("2026-02-16T10:00:00.000Z"),
                aqi: 100,
                pm25: 20,
                pm10: 30,
                temperature: 32,
                humidity: 50,
            },
            daily: {
                dayStart: new Date("2026-02-16T00:00:00.000Z"),
                count: 10,
                avgAqi: 90,
                minAqi: 50,
                maxAqi: 120,
                aqiLevel: "Moderate",
            },
        };

        (DashboardOverviewService.getOverview as any).mockResolvedValue(mockData);

        const req = new Request(
            "http://localhost/api/user/dashboard/overview?deviceId=device123&date=2026-02-16"
        );

        const res = await DashboardOverviewController(req);
        const json = await res.json();

        expect(res.status).toBe(200);

        expect(json).toEqual({
            success: true,
            data: {
                latest: {
                    ...mockData.latest,
                    measuredAt: mockData.latest.measuredAt.toISOString(),
                },
                daily: {
                    ...mockData.daily,
                    dayStart: mockData.daily.dayStart.toISOString(),
                },
            },
        });
    });

    it("should return 500 if service throws error", async () => {
        (DashboardOverviewService.getOverview as any).mockRejectedValue(
            new Error("DB error")
        );

        const req = new Request(
            "http://localhost/api/user/dashboard/overview?deviceId=device123&date=2026-02-16"
        );

        const res = await DashboardOverviewController(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Internal Server Error");
    });
});
