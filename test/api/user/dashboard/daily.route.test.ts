import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/user/dashboard/daily/route";
import { DailyDashboardController } from "@/domains/dashboard/controllers/daily.controller";

vi.mock("@/domains/dashboard/controllers/daily.controller", () => ({
    DailyDashboardController: vi.fn(),
}));

describe("GET /api/user/dashboard/daily", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call DailyDashboardController", async () => {
        const mockResponse = new Response(
            JSON.stringify({ success: true, data: {} }),
            { status: 200 }
        );

        (DailyDashboardController as any).mockResolvedValue(mockResponse);

        const req = new Request(
            "http://localhost/api/user/dashboard/daily?deviceId=device123&date=2026-02-16",
            { method: "GET" }
        );

        const res = await GET(req);

        expect(DailyDashboardController).toHaveBeenCalledTimes(1);
        expect(DailyDashboardController).toHaveBeenCalledWith(req);
        expect(res.status).toBe(200);
    });
});
