import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/user/dashboard/hourly/route";
import { HourlyDashboardController } from "@/domains/dashboard/controllers/hourly.controller";

vi.mock("@/domains/dashboard/controllers/hourly.controller", () => ({
    HourlyDashboardController: vi.fn(),
}));

describe("GET /api/user/dashboard/hourly", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call HourlyDashboardController and return response", async () => {
        const mockResponse = new Response(
            JSON.stringify({ success: true, data: [] }),
            { status: 200 }
        );

        (HourlyDashboardController as any).mockResolvedValue(mockResponse);

        const req = new Request(
            "http://localhost/api/user/dashboard/hourly?deviceId=device123&date=2026-02-16",
            { method: "GET" }
        );

        const res = await GET(req);

        expect(HourlyDashboardController).toHaveBeenCalledTimes(1);
        expect(HourlyDashboardController).toHaveBeenCalledWith(req);
        expect(res.status).toBe(200);
    });

    it("should return 500 if HourlyDashboardController throws error", async () => {
        (HourlyDashboardController as any).mockImplementation(() => {
            throw new Error("Controller error");
        });

        const req = new Request(
            "http://localhost/api/dashboard/hourly?deviceId=device123&date=2026-02-16",
            { method: "GET" }
        );

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Internal Server Error");
    });
});
