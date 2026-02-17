import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserDeviceController } from "@/domains/dashboard/controllers/user-device.controller";
import { UserDeviceService } from "@/domains/dashboard/services/user-device.service";
import { getAuthSession } from "@/auth";

vi.mock("@/auth", () => ({
    getAuthSession: vi.fn(),
}));

vi.mock("@/domains/dashboard/services/user-device.service", () => ({
    UserDeviceService: {
        getUserDevices: vi.fn(),
    },
}));

describe("UserDeviceController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 404 if user is unauthorized", async () => {
        (getAuthSession as any).mockResolvedValue(null);

        const req = new Request("http://localhost/api/user/dashboard/user-devices", {
            method: "GET",
        });

        const res = await UserDeviceController(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error).toBe("Unauthorized");
    });

    it("should return 200 with devices if session exists", async () => {
        (getAuthSession as any).mockResolvedValue({
            user: { id: "user123" },
        });

        (UserDeviceService.getUserDevices as any).mockResolvedValue([
            {
                id: "device1",
                name: "Sensor 1",
                serialNo: "aqi1892",
                isActive: true,
                status: "ASSIGNED",
            },
        ]);

        const req = new Request("http://localhost/api/user/dashboard/user-devices", {
            method: "GET",
        });

        const res = await UserDeviceController(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.length).toBe(1);
        expect(json.data[0].serialNo).toBe("aqi1892");

        expect(UserDeviceService.getUserDevices).toHaveBeenCalledTimes(1);
        expect(UserDeviceService.getUserDevices).toHaveBeenCalledWith("user123");
    });

    it("should return 500 if service throws error", async () => {
        (getAuthSession as any).mockResolvedValue({
            user: { id: "user123" },
        });

        (UserDeviceService.getUserDevices as any).mockRejectedValue(
            new Error("DB error")
        );

        const req = new Request("http://localhost/api/user/dashboard/user-devices", {
            method: "GET",
        });

        const res = await UserDeviceController(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.error).toBe("Internal Server Error");
    });
});
