import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/user/dashboard/device/route";
import { DeviceService } from "@/domains/dashboard/services/device.service";

vi.mock("@/domains/dashboard/services/device.service", () => ({
    DeviceService: {
        getDeviceInfo: vi.fn(),
    },
}));

describe("GET /api/user/dashboard/device", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 400 if deviceId and serialNo missing", async () => {
        const req = new Request("http://localhost/api/user/dashboard/device", {
            method: "GET",
        });

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("deviceId or serialNo is required");
    });

    it("should return 200 if device found by deviceId", async () => {
        (DeviceService.getDeviceInfo as any).mockResolvedValue({
            id: "device123",
            serialNo: "aqi1892",
            isActive: true,
        });

        const req = new Request(
            "http://localhost/api/user/dashboard/device?deviceId=device123",
            { method: "GET" }
        );

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.id).toBe("device123");
    });

    it("should return 200 if device found by serialNo", async () => {
        (DeviceService.getDeviceInfo as any).mockResolvedValue({
            id: "device123",
            serialNo: "aqi1892",
            isActive: true,
        });

        const req = new Request(
            "http://localhost/api/user/dashboard/device?serialNo=aqi1892",
            { method: "GET" }
        );

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.serialNo).toBe("aqi1892");
    });

    it("should return 404 if device not found", async () => {
        (DeviceService.getDeviceInfo as any).mockResolvedValue(null);

        const req = new Request(
            "http://localhost/api/user/dashboard/device?deviceId=device123",
            { method: "GET" }
        );

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe("Device not found");
    });

    it("should return 500 if service throws error", async () => {
        (DeviceService.getDeviceInfo as any).mockRejectedValue(
            new Error("DB error")
        );

        const req = new Request(
            "http://localhost/api/user/dashboard/device?deviceId=device123",
            { method: "GET" }
        );

        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Internal Server Error");
    });
});
