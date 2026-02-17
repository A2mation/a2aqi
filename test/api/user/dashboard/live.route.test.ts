import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/user/dashboard/live/route";
import { LiveDashboardController } from "@/domains/dashboard/controllers/live.controller";

vi.mock("@/domains/dashboard/controllers/live.controller", () => ({
    LiveDashboardController: vi.fn(),
}));

describe("GET /api/user/dashboard/live", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call LiveDashboardController", async () => {
        const mockResponse = new Response(
            JSON.stringify({ success: true, data: {} }),
            { status: 200 }
        );

        (LiveDashboardController as any).mockResolvedValue(mockResponse);

        const req = new Request(
            "http://localhost/api/user/dashboard/live?deviceId=device123",
            { method: "GET" }
        );

        const res = await GET(req);

        expect(LiveDashboardController).toHaveBeenCalledTimes(1);
        expect(LiveDashboardController).toHaveBeenCalledWith(req);
        expect(res.status).toBe(200);
    });
});
