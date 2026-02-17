import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeviceController } from "@/domains/dashboard/controllers/device.controller";
import { DeviceService } from "@/domains/dashboard/services/device.service";

vi.mock("@/domains/dashboard/services/device.service", () => ({
    DeviceService: {
        getDeviceInfo: vi.fn(),
    },
}));

describe("DeviceController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 400 if deviceId and serialNo are missing", async () => {
        const req = new Request("http://localhost/api/user/dashboard/device");

        const res = await DeviceController(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("deviceId or serialNo is required");
    });

    it("should return 404 if device not found", async () => {
        (DeviceService.getDeviceInfo as any).mockResolvedValue(null);

        const req = new Request(
            "http://localhost/api/user/dashboard/device?deviceId=device123"
        );

        const res = await DeviceController(req);
        const json = await res.json();

        expect(DeviceService.getDeviceInfo).toHaveBeenCalledTimes(1);
        expect(DeviceService.getDeviceInfo).toHaveBeenCalledWith("device123", null);

        expect(res.status).toBe(404);
        expect(json.error).toBe("Device not found");
    });

    it("should return 200 with device data if found (deviceId)", async () => {
        const mockDevice = {
            id: "device123",
            name: "My Sensor",
            serialNo: "aqi1892",
            isActive: true,
            status: "ASSIGNED",
            apiKey: "secret",
            lat: 10.22,
            lng: 77.44,
            assignedAt: null,
            createdAt: new Date("2026-02-01T00:00:00.000Z"),
            updatedAt: new Date("2026-02-10T00:00:00.000Z"),
        };

        (DeviceService.getDeviceInfo as any).mockResolvedValue(mockDevice);

        const req = new Request("http://localhost/api/device?deviceId=device123");

        const res = await DeviceController(req);
        const json = await res.json();

        expect(res.status).toBe(200);

        expect(json).toEqual({
            success: true,
            data: {
                ...mockDevice,
                createdAt: mockDevice.createdAt.toISOString(),
                updatedAt: mockDevice.updatedAt.toISOString(),
            },
        });
    });

    it("should return 200 with device data if found (serialNo)", async () => {
        const mockDevice = {
            id: "device123",
            name: null,
            serialNo: "aqi1892",
            isActive: true,
            status: "ASSIGNED",
            apiKey: "secret",
            lat: null,
            lng: null,
            assignedAt: null,
            createdAt: new Date("2026-02-01T00:00:00.000Z"),
            updatedAt: new Date("2026-02-10T00:00:00.000Z"),
        };

        (DeviceService.getDeviceInfo as any).mockResolvedValue(mockDevice);

        const req = new Request("http://localhost/api/device?serialNo=aqi1892");

        const res = await DeviceController(req);
        const json = await res.json();

        expect(res.status).toBe(200);

        expect(json).toEqual({
            success: true,
            data: {
                ...mockDevice,
                createdAt: mockDevice.createdAt.toISOString(),
                updatedAt: mockDevice.updatedAt.toISOString(),
            },
        });
    });

    it("should return 500 if service throws error", async () => {
        (DeviceService.getDeviceInfo as any).mockRejectedValue(
            new Error("DB error")
        );

        const req = new Request(
            "http://localhost/api/user/dashboard/device?deviceId=device123"
        );

        const res = await DeviceController(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Internal Server Error");
    });
});
