import { describe, it, expect, beforeEach, vi } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

import { authenticateSensor } from "@/domains/sensors/sensor.auth";

describe("Sensor Auth", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should authenticate valid device", async () => {
        prismaMock.device.findUnique.mockResolvedValue({
            id: "65f123abc456def7890abc12",
            apiKey: "secret",
            isActive: true,
        } as any);

        const device = await authenticateSensor(
            "65f123abc456def7890abc12",
            "secret"
        );

        expect(device.id).toBe("65f123abc456def7890abc12");
    });

    it("should throw if device not found", async () => {
        prismaMock.device.findUnique.mockResolvedValue(null);

        await expect(
            authenticateSensor("65f123abc456def7890abc12", "secret")
        ).rejects.toThrow("Device not found");
    });

    it("should throw if device disabled", async () => {
        prismaMock.device.findUnique.mockResolvedValue({
            id: "65f123abc456def7890abc12",
            apiKey: "secret",
            isActive: false,
        } as any);

        await expect(
            authenticateSensor("65f123abc456def7890abc12", "secret")
        ).rejects.toThrow("Device is disabled");
    });

    it("should throw if api key invalid", async () => {
        prismaMock.device.findUnique.mockResolvedValue({
            id: "65f123abc456def7890abc12",
            apiKey: "secret",
            isActive: true,
        } as any);

        await expect(
            authenticateSensor("65f123abc456def7890abc12", "wrong-key")
        ).rejects.toThrow("Invalid API key");
    });
});
