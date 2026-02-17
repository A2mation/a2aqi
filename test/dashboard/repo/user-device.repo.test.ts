import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";
import { deviceDefaultSelect } from "@/domains/dashboard/dto/user-device.select.dto";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

import { UserDeviceRepo } from "@/domains/dashboard/repositories/user-device.repo";

describe("UserDeviceRepo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return devices by userId", async () => {
        const mockDevices = [
            {
                id: "device123",
                name: "Sensor 1",
                serialNo: "aqi1892",
                isActive: true,
                status: "ASSIGNED",
            },
        ];

        (prismaMock.device.findMany as any).mockResolvedValue(mockDevices);

        const result = await UserDeviceRepo.findDeviceByuserId("user123");

        expect(prismaMock.device.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.device.findMany).toHaveBeenCalledWith({
            where: { userId: "user123" },
            select: deviceDefaultSelect,
        });

        expect(result).toEqual(mockDevices);
    });

    it("should return empty array if no devices found", async () => {
        (prismaMock.device.findMany as any).mockResolvedValue([]);

        const result = await UserDeviceRepo.findDeviceByuserId("user123");

        expect(result).toEqual([]);
    });

    it("should throw error if prisma fails", async () => {
        (prismaMock.device.findMany as any).mockRejectedValue(new Error("DB error"));

        await expect(UserDeviceRepo.findDeviceByuserId("user123")).rejects.toThrow(
            "DB error"
        );
    });
});
