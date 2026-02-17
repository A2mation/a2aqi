import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserDeviceService } from "@/domains/dashboard/services/user-device.service";
import { UserDeviceRepo } from "@/domains/dashboard/repositories/user-device.repo";

vi.mock("@/domains/dashboard/repositories/user-device.repo", () => ({
    UserDeviceRepo: {
        findDeviceByuserId: vi.fn(),
    },
}));

describe("UserDeviceService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should throw error if userId is missing", async () => {
        await expect(UserDeviceService.getUserDevices("")).rejects.toThrow(
            "userId is required"
        );
    });

    it("should return formatted devices list", async () => {
        (UserDeviceRepo.findDeviceByuserId as any).mockResolvedValue([
            {
                id: "device123",
                name: "My Sensor",
                serialNo: "aqi1892",
                isActive: true,
                status: "ASSIGNED",
                lat: 10.22,
                lng: 77.44,
                assignedAt: new Date("2026-02-16T00:00:00.000Z"),
                createdAt: new Date("2026-02-01T00:00:00.000Z"),
                updatedAt: new Date("2026-02-10T00:00:00.000Z"),
                model: {
                    id: "model123",
                    name: "PurpleAir",
                    manufacturer: "PurpleAir Inc",
                },
            },
        ]);

        const result = await UserDeviceService.getUserDevices("user123");

        expect(UserDeviceRepo.findDeviceByuserId).toHaveBeenCalledTimes(1);
        expect(UserDeviceRepo.findDeviceByuserId).toHaveBeenCalledWith("user123");

        expect(result).toEqual([
            {
                id: "device123",
                name: "My Sensor",
                serialNo: "aqi1892",
                isActive: true,
                status: "ASSIGNED",
                lat: 10.22,
                lng: 77.44,
                assignedAt: new Date("2026-02-16T00:00:00.000Z"),
                createdAt: new Date("2026-02-01T00:00:00.000Z"),
                updatedAt: new Date("2026-02-10T00:00:00.000Z"),
                model: {
                    id: "model123",
                    name: "PurpleAir",
                    manufacturer: "PurpleAir Inc",
                },
            },
        ]);
    });

    it("should return empty array if no devices found", async () => {
        (UserDeviceRepo.findDeviceByuserId as any).mockResolvedValue([]);

        const result = await UserDeviceService.getUserDevices("user123");

        expect(result).toEqual([]);
    });

    it("should throw error if repo fails", async () => {
        (UserDeviceRepo.findDeviceByuserId as any).mockRejectedValue(
            new Error("DB error")
        );

        await expect(UserDeviceService.getUserDevices("user123")).rejects.toThrow(
            "DB error"
        );
    });
});
