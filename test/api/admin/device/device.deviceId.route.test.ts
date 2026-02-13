import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";
import { DeviceStatus } from "@prisma/client";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

vi.mock("@/lib/adminAuth", () => ({
    adminGuard: vi.fn(),
})); 

vi.mock("@/lib/errorResponse", () => ({
    handleAdminError: vi.fn((err: any) => {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }),
}));

import { adminGuard } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { GET, PATCH, DELETE } from "@/app/api/admin/device/[deviceId]/route";

describe("Device [deviceId] API Route (adminGuard + handleAdminError)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const params = (deviceId: string) => ({
        params: Promise.resolve({ deviceId }),
    });

    // -----------------------------
    // GET TESTS
    // -----------------------------
    describe("GET /api/admin/device/[deviceId]", () => {
        it("should return 401 if adminGuard throws", async () => {
            (adminGuard as any).mockRejectedValue(new Error("ADMIN ACCESS ONLY ROUTE"));

            const res = await GET(new Request("http://localhost"), params("123"));
            const json = await res.json();

            expect(res.status).toBe(401);
            expect(json.error).toBe("ADMIN ACCESS ONLY ROUTE");
        });

        it("should return 400 if deviceId missing", async () => {
            (adminGuard as any).mockResolvedValue(true);

            const res = await GET(new Request("http://localhost"), params(""));
            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Device ID not Found");
        });

        it("should return 404 if device not found", async () => {
            (adminGuard as any).mockResolvedValue(true);

            (prisma.device.findUnique as any).mockResolvedValue(null);

            const res = await GET(new Request("http://localhost"), params("123"));
            const text = await res.text();

            expect(res.status).toBe(404);
            expect(text).toBe("Device not found");
        });

        it("should return device if found", async () => {
            (adminGuard as any).mockResolvedValue(true);

            (prisma.device.findUnique as any).mockResolvedValue({
                id: "123",
                serialNo: "SERIAL001",
            });

            const res = await GET(new Request("http://localhost"), params("123"));
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.id).toBe("123");
            expect(json.serialNo).toBe("SERIAL001");
        });
    });

    // -----------------------------
    // PATCH TESTS
    // -----------------------------
    describe("PATCH /api/admin/device/[deviceId]", () => {
        it("should return 401 if adminGuard throws", async () => {
            (adminGuard as any).mockRejectedValue(new Error("Unauthorized"));

            const req = new Request("http://localhost", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            const res = await PATCH(req, params("123"));
            const json = await res.json();

            expect(res.status).toBe(401);
            expect(json.error).toBe("Unauthorized");
        });

        it("should return 400 if deviceId missing", async () => {
            (adminGuard as any).mockResolvedValue(true);

            const req = new Request("http://localhost", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            const res = await PATCH(req, params(""));
            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Device ID not Found");
        });

        it("should return 400 if serialNo missing", async () => {
            (adminGuard as any).mockResolvedValue(true);

            const req = new Request("http://localhost", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    modelId: "model123",
                }),
            });

            const res = await PATCH(req, params("123"));
            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Serial No is required");
        });

        it("should return 400 if modelId missing", async () => {
            (adminGuard as any).mockResolvedValue(true);

            const req = new Request("http://localhost", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serialNo: "SERIAL001",
                }),
            });

            const res = await PATCH(req, params("123"));
            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Model ID is required");
        });

        it("should return 400 if model invalid", async () => {
            (adminGuard as any).mockResolvedValue(true);

            (prisma.deviceModel.findUnique as any).mockResolvedValue(null);

            const req = new Request("http://localhost", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serialNo: "SERIAL001",
                    modelId: "model123",
                }),
            });

            const res = await PATCH(req, params("123"));
            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Invalid Model");
        });

        it("should return 400 if lat is invalid", async () => {
            (adminGuard as any).mockResolvedValue(true);

            (prisma.deviceModel.findUnique as any).mockResolvedValue({
                id: "model123",
            });

            const req = new Request("http://localhost", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serialNo: "SERIAL001",
                    modelId: "model123",
                    lat: "invalid-lat",
                }),
            });

            const res = await PATCH(req, params("123"));
            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Invalid latitude value");
        });

        it("should return 400 if lng is invalid", async () => {
            (adminGuard as any).mockResolvedValue(true);

            (prisma.deviceModel.findUnique as any).mockResolvedValue({
                id: "model123",
            });

            const req = new Request("http://localhost", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serialNo: "SERIAL001",
                    modelId: "model123",
                    lng: "invalid-lng",
                }),
            });

            const res = await PATCH(req, params("123"));
            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Invalid longitude value");
        });

        it("should update device successfully", async () => {
            (adminGuard as any).mockResolvedValue(true);

            (prisma.deviceModel.findUnique as any).mockResolvedValue({
                id: "model123",
            });

            (prisma.device.update as any).mockResolvedValue({
                id: "123",
                serialNo: "SERIAL001",
                modelId: "model123",
                status: DeviceStatus.ASSIGNED,
            });

            const req = new Request("http://localhost", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Updated Device",
                    serialNo: "SERIAL001",
                    modelId: "model123",
                    lat: "20.5",
                    lng: "78.5",
                    status: DeviceStatus.ASSIGNED,
                }),
            });

            const res = await PATCH(req, params("123"));
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.serialNo).toBe("SERIAL001");
            expect(prisma.device.update).toHaveBeenCalledTimes(1);
        });
    });

    // -----------------------------
    // DELETE TESTS
    // -----------------------------
    describe("DELETE /api/admin/device/[deviceId]", () => {
        it("should return 401 if adminGuard throws", async () => {
            (adminGuard as any).mockRejectedValue(new Error("ADMIN ACCESS ONLY ROUTE"));

            const res = await DELETE(new Request("http://localhost"), params("123"));
            const json = await res.json();

            expect(res.status).toBe(401);
            expect(json.error).toBe("ADMIN ACCESS ONLY ROUTE");
        });

        it("should return 400 if deviceId missing", async () => {
            (adminGuard as any).mockResolvedValue(true);

            const res = await DELETE(new Request("http://localhost"), params(""));
            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Device ID not Found");
        });

        it("should delete device successfully", async () => {
            (adminGuard as any).mockResolvedValue(true);

            (prisma.device.delete as any).mockResolvedValue({
                id: "123",
            });

            const res = await DELETE(new Request("http://localhost"), params("123"));
            const text = await res.text();

            expect(res.status).toBe(200);
            expect(text).toBe("Device deleted successfully");
            expect(prisma.device.delete).toHaveBeenCalledTimes(1);
        });
    });
});
