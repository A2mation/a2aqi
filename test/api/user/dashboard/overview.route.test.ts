import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/user/dashboard/overview/route";
import { DashboardOverviewController } from "@/domains/dashboard/controllers/dashboard.controller";

vi.mock("@/domains/dashboard/controllers/dashboard.controller", () => ({
    DashboardOverviewController: vi.fn(),
}));

describe("GET /api/user/dashboard/overview", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call DashboardOverviewController", async () => {
        const mockResponse = new Response(
            JSON.stringify({ success: true, data: {} }),
            { status: 200 }
        );

        (DashboardOverviewController as any).mockResolvedValue(mockResponse);

        const req = new Request(
            "http://localhost/api/user/dashboard/overview?deviceId=device123",
            { method: "GET" }
        );

        const res = await GET(req);

        expect(DashboardOverviewController).toHaveBeenCalledTimes(1);
        expect(DashboardOverviewController).toHaveBeenCalledWith(req);
        expect(res.status).toBe(200);
    });
});
