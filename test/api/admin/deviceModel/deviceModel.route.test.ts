import { describe, it, expect, vi, beforeEach } from "vitest";

import { prismaMock } from "@/lib/__mocks__/prisma.test";


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

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { GET, POST } from "@/app/api/admin/device-model/route";

describe("Device Model Route (/api/admin/device-model)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ------------------------
    // GET TESTS
    // ------------------------
    describe("GET", () => {
        it("should return 401 if adminGuard throws", async () => {
            (adminGuard as any).mockRejectedValue(new Error("ADMIN ACCESS ONLY ROUTE"));

            const res = await GET();
            const json = await res.json();

            expect(res.status).toBe(401);
            expect(json.error).toBe("ADMIN ACCESS ONLY ROUTE");
        });

        it("should return device models list", async () => {
            (adminGuard as any).mockResolvedValue(true);

            (prisma.deviceModel.findMany as any).mockResolvedValue([
                { id: "1", name: "Model A" },
                { id: "2", name: "Model B" },
            ]);

            const res = await GET();
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.length).toBe(2);
            expect(json[0].name).toBe("Model A");
            expect(prisma.deviceModel.findMany).toHaveBeenCalledTimes(1);
        });
    });

    // ------------------------
    // POST TESTS
    // ------------------------
    describe("POST", () => {
        it("should return 401 if adminGuard throws", async () => {
            (adminGuard as any).mockRejectedValue(new Error("Unauthorized"));

            const req = new Request("http://localhost/api/admin/device-model", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Test Model",
                    manufacturer: "Test Manufacturer",
                }),
            });

            const res = await POST(req);
            const json = await res.json();

            expect(res.status).toBe(401);
            expect(json.error).toBe("Unauthorized");
        });

        it("should return 400 if name is missing", async () => {
            (adminGuard as any).mockResolvedValue(true);

            const req = new Request("http://localhost/api/admin/device-model", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    manufacturer: "ABC",
                }),
            });

            const res = await POST(req);

            const text = await res.text();
            expect(res.status).toBe(400);
            expect(text).toBe("Name and manufacturer are required");
        });

        it("should create device model and return 201", async () => {
            (adminGuard as any).mockResolvedValue(true);

            (prisma.deviceModel.create as any).mockResolvedValue({
                id: "123",
                name: "Model X",
                manufacturer: "Company A",
                description: "Air sensor model",
            });

            const req = new Request("http://localhost/api/admin/device-model", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Model X",
                    manufacturer: "Company A",
                    description: "Air sensor model",
                }),
            });

            const res = await POST(req);
            const json = await res.json();

            expect(res.status).toBe(201);
            expect(json.id).toBe("123");
            expect(json.name).toBe("Model X");
            expect(prisma.deviceModel.create).toHaveBeenCalledTimes(1);
        });
    });
});
