import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/user/dashboard/weekly/route";
import { WeeklyDashboardController } from "@/domains/dashboard/controllers/weekly.controller";

vi.mock("@/domains/dashboard/controllers/weekly.controller", () => ({
    WeeklyDashboardController: vi.fn(),
}));

describe("GET /api/user/dashboard/weekly", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call WeeklyDashboardController and return response", async () => {
        const mockRes = new Response(
            JSON.stringify({ success: true, data: [] }),
            { status: 200 }
        );

        (WeeklyDashboardController as any).mockResolvedValue(mockRes);

        const req = new Request(
            "http://localhost/api/user/dashboard/weekly?deviceId=device123&date=2026-02-18"
        );

        const res = await GET(req);

        expect(WeeklyDashboardController).toHaveBeenCalledTimes(1);
        expect(WeeklyDashboardController).toHaveBeenCalledWith(req);

        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json.success).toBe(true);
        expect(json.data).toEqual([]);
    });
});
