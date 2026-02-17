import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

import { DeviceRepo } from "@/domains/dashboard/repositories/device.repo";

describe("DeviceRepo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should find device by id", async () => {
        const mockDevice = {
            id: "device123",
            serialNo: "aqi1892",
            isActive: true,
        };

        (prismaMock.device.findUnique as any).mockResolvedValue(mockDevice);

        const result = await DeviceRepo.findById("device123");

        expect(prismaMock.device.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaMock.device.findUnique).toHaveBeenCalledWith({
            where: { id: "device123" },
        });

        expect(result).toEqual(mockDevice);
    });

    it("should find device by serialNo", async () => {
        const mockDevice = {
            id: "device123",
            serialNo: "aqi1892",
            isActive: true,
        };

        (prismaMock.device.findUnique as any).mockResolvedValue(mockDevice);

        const result = await DeviceRepo.findBySerialNo("aqi1892");

        expect(prismaMock.device.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaMock.device.findUnique).toHaveBeenCalledWith({
            where: { serialNo: "aqi1892" },
        });

        expect(result).toEqual(mockDevice);
    });

    it("should return null if device not found", async () => {
        (prismaMock.device.findUnique as any).mockResolvedValue(null);

        const result = await DeviceRepo.findById("unknown");

        expect(result).toBeNull();
    });

    it("should throw error if prisma fails", async () => {
        (prismaMock.device.findUnique as any).mockRejectedValue(
            new Error("DB error")
        );

        await expect(DeviceRepo.findById("device123")).rejects.toThrow("DB error");
    });
});
