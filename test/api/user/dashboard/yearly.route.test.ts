import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/user/dashboard/yearly/route";
import { YearlyDashboardController } from "@/domains/dashboard/controllers/yearly.controller";

vi.mock("@/domains/dashboard/controllers/yearly.controller", () => ({
    YearlyDashboardController: vi.fn(),
}));

describe("GET /api/user/dashboard/yearly", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call YearlyDashboardController", async () => {
        const mockResponse = new Response(
            JSON.stringify({ success: true, data: [] }),
            { status: 200 }
        );

        (YearlyDashboardController as any).mockResolvedValue(mockResponse);

        const req = new Request(
            "http://localhost/api/user/dashboard/yearly?deviceId=device123&year=2026",
            { method: "GET" }
        );

        const res = await GET(req);

        expect(YearlyDashboardController).toHaveBeenCalledTimes(1);
        expect(YearlyDashboardController).toHaveBeenCalledWith(req);
        expect(res.status).toBe(200);
    });
});
