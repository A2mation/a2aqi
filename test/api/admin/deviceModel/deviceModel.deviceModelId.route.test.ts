import { describe, it, expect, vi, beforeEach } from "vitest";

import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));


vi.mock("@/lib/adminAuth", () => ({
    adminGuard: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { GET, PATCH, DELETE } from "@/app/api/admin/device-model/[deviceModelId]/route";

describe("Device Model [deviceModelId] Route", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ------------------------
    // GET TESTS
    // ------------------------
    describe("GET", () => {
        it("should return 401 if adminGuard fails", async () => {
            (adminGuard as any).mockRejectedValue(new Error("ADMIN ACCESS ONLY ROUTE"));

            const res = await GET({} as Request, {
                params: Promise.resolve({ deviceModelId: "123" }),
            });

            const json = await res.json();

            expect(res.status).toBe(401);
            expect(json.error).toBe("ADMIN ACCESS ONLY ROUTE");
        });

        it("should return 400 if deviceModelId missing", async () => {
            (adminGuard as any).mockResolvedValue({ admin: {}, session: {} });

            const res = await GET({} as Request, {
                params: Promise.resolve({ deviceModelId: "" }),
            });

            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Device Model ID not Found");
        });

        it("should return 404 if device model not found", async () => {
            (adminGuard as any).mockResolvedValue({ admin: {}, session: {} });
            (prisma.deviceModel.findUnique as any).mockResolvedValue(null);

            const res = await GET({} as Request, {
                params: Promise.resolve({ deviceModelId: "123" }),
            });

            const text = await res.text();

            expect(res.status).toBe(404);
            expect(text).toBe("Device Model not found");
        });

        it("should return 200 if device model exists", async () => {
            (adminGuard as any).mockResolvedValue({ admin: {}, session: {} });

            (prisma.deviceModel.findUnique as any).mockResolvedValue({
                id: "123",
                name: "Model A",
                description: "Test model",
                isActive: true,
            });

            const res = await GET({} as Request, {
                params: Promise.resolve({ deviceModelId: "123" }),
            });

            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.id).toBe("123");
            expect(json.name).toBe("Model A");
        });
    });

    // ------------------------
    // PATCH TESTS
    // ------------------------
    describe("PATCH", () => {
        it("should return 401 if adminGuard fails", async () => {
            (adminGuard as any).mockRejectedValue(new Error("Unauthorized"));

            const req = new Request("http://localhost", {
                method: "PATCH",
                body: JSON.stringify({ name: "NewName" }),
            });

            const res = await PATCH(req, {
                params: Promise.resolve({ deviceModelId: "123" }),
            });

            const json = await res.json();

            expect(res.status).toBe(401);
            expect(json.error).toBe("Unauthorized");
        });

        it("should return 400 if deviceModelId missing", async () => {
            (adminGuard as any).mockResolvedValue({ admin: {}, session: {} });

            const req = new Request("http://localhost", {
                method: "PATCH",
                body: JSON.stringify({ name: "NewName" }),
            });

            const res = await PATCH(req, {
                params: Promise.resolve({ deviceModelId: "" }),
            });

            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Device Model ID not Found");
        });

        it("should return 200 if updated successfully", async () => {
            (adminGuard as any).mockResolvedValue({ admin: {}, session: {} });

            (prisma.deviceModel.update as any).mockResolvedValue({
                id: "123",
                name: "Updated Model",
                description: "Updated Desc",
                isActive: true,
            });

            const req = new Request("http://localhost", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Updated Model",
                    description: "Updated Desc",
                    isActive: true,
                }),
            });

            const res = await PATCH(req, {
                params: Promise.resolve({ deviceModelId: "123" }),
            });

            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.name).toBe("Updated Model");
            expect(prisma.deviceModel.update).toHaveBeenCalledTimes(1);
        });
    });

    // ------------------------
    // DELETE TESTS
    // ------------------------
    describe("DELETE", () => {
        it("should return 401 if adminGuard fails", async () => {
            (adminGuard as any).mockRejectedValue(new Error("ADMIN ACCESS ONLY ROUTE"));

            const req = new Request("http://localhost", {
                method: "DELETE",
            });

            const res = await DELETE(req, {
                params: Promise.resolve({ deviceModelId: "123" }),
            });

            const json = await res.json();

            expect(res.status).toBe(401);
            expect(json.error).toBe("ADMIN ACCESS ONLY ROUTE");
        });

        it("should return 400 if deviceModelId missing", async () => {
            (adminGuard as any).mockResolvedValue({ admin: {}, session: {} });

            const req = new Request("http://localhost", {
                method: "DELETE",
            });

            const res = await DELETE(req, {
                params: Promise.resolve({ deviceModelId: "" }),
            });

            const text = await res.text();

            expect(res.status).toBe(400);
            expect(text).toBe("Device Model ID not Found");
        });

        it("should return 200 if deleted successfully", async () => {
            (adminGuard as any).mockResolvedValue({ admin: {}, session: {} });

            (prisma.deviceModel.delete as any).mockResolvedValue({
                id: "123",
                name: "Model Deleted",
            });

            const req = new Request("http://localhost", {
                method: "DELETE",
            });

            const res = await DELETE(req, {
                params: Promise.resolve({ deviceModelId: "123" }),
            });

            const text = await res.text();

            expect(res.status).toBe(200);
            expect(text).toBe("Device Model deleted successfully");
            expect(prisma.deviceModel.delete).toHaveBeenCalledTimes(1);
        });
    });
});
