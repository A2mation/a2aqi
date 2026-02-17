import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/user/dashboard/monthly/route";
import { MonthlyDashboardController } from "@/domains/dashboard/controllers/monthly.controller";

vi.mock("@/domains/dashboard/controllers/monthly.controller", () => ({
    MonthlyDashboardController: vi.fn(),
}));

describe("GET /api/dashboard/monthly", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call MonthlyDashboardController", async () => {
        const mockResponse = new Response(
            JSON.stringify({ success: true, data: [] }),
            { status: 200 }
        );

        (MonthlyDashboardController as any).mockResolvedValue(mockResponse);

        const req = new Request(
            "http://localhost/api/user/dashboard/monthly?deviceId=device123&year=2026&month=2",
            { method: "GET" }
        );

        const res = await GET(req);

        expect(MonthlyDashboardController).toHaveBeenCalledTimes(1);
        expect(MonthlyDashboardController).toHaveBeenCalledWith(req);
        expect(res.status).toBe(200);
    });
});
