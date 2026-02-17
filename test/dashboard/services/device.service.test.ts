import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeviceService } from "@/domains/dashboard/services/device.service";
import { DeviceRepo } from "@/domains/dashboard/repositories/device.repo";

vi.mock("@/domains/dashboard/repositories/device.repo", () => ({
    DeviceRepo: {
        findById: vi.fn(),
        findBySerialNo: vi.fn(),
    },
}));

describe("DeviceService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should throw error if both deviceId and serialNo are missing", async () => {
        await expect(DeviceService.getDeviceInfo(null, null)).rejects.toThrow(
            "deviceId or serialNo is required"
        );
    });

    it("should return device info when found by deviceId", async () => {
        (DeviceRepo.findById as any).mockResolvedValue({
            id: "device123",
            name: "Sensor 1",
            serialNo: "aqi1892",
            isActive: true,
            status: "ASSIGNED",
            apiKey: "secret",
            lat: 10.22,
            lng: 77.44,
            assignedAt: new Date("2026-02-16T00:00:00.000Z"),
            createdAt: new Date("2026-02-01T00:00:00.000Z"),
            updatedAt: new Date("2026-02-10T00:00:00.000Z"),
        });

        const result = await DeviceService.getDeviceInfo("device123", null);

        expect(DeviceRepo.findById).toHaveBeenCalledTimes(1);
        expect(DeviceRepo.findById).toHaveBeenCalledWith("device123");
        expect(DeviceRepo.findBySerialNo).not.toHaveBeenCalled();

        expect(result).toEqual({
            id: "device123",
            name: "Sensor 1",
            serialNo: "aqi1892",
            isActive: true,
            status: "ASSIGNED",
            apiKey: "secret",
            lat: 10.22,
            lng: 77.44,
            assignedAt: new Date("2026-02-16T00:00:00.000Z"),
            createdAt: new Date("2026-02-01T00:00:00.000Z"),
            updatedAt: new Date("2026-02-10T00:00:00.000Z"),
        });
    });

    it("should return device info when found by serialNo", async () => {
        (DeviceRepo.findBySerialNo as any).mockResolvedValue({
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
        });

        const result = await DeviceService.getDeviceInfo(null, "aqi1892");

        expect(DeviceRepo.findBySerialNo).toHaveBeenCalledTimes(1);
        expect(DeviceRepo.findBySerialNo).toHaveBeenCalledWith("aqi1892");
        expect(DeviceRepo.findById).not.toHaveBeenCalled();

        expect(result).toEqual({
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
        });
    });

    it("should return null if device not found", async () => {
        (DeviceRepo.findById as any).mockResolvedValue(null);

        const result = await DeviceService.getDeviceInfo("device123", null);

        expect(result).toBeNull();
    });

    it("should throw error if repo throws error", async () => {
        (DeviceRepo.findById as any).mockRejectedValue(new Error("DB error"));

        await expect(
            DeviceService.getDeviceInfo("device123", null)
        ).rejects.toThrow("DB error");
    });
});
