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

import { adminGuard } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/admin/device/route";

describe("Device API Route (adminGuard + handleAdminError)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -----------------------
    // GET TESTS
    // -----------------------

    it("GET should return 401 if adminGuard throws", async () => {
        (adminGuard as any).mockRejectedValue(new Error("ADMIN ACCESS ONLY ROUTE"));

        const res = await GET();
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe("ADMIN ACCESS ONLY ROUTE");
    });

    it("GET should return devices if adminGuard passes", async () => {
        (adminGuard as any).mockResolvedValue(true);

        (prisma.device.findMany as any).mockResolvedValue([
            { id: "device1", serialNo: "SERIAL001" },
        ]);

        const res = await GET();
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.length).toBe(1);
        expect(json[0].serialNo).toBe("SERIAL001");
        expect(prisma.device.findMany).toHaveBeenCalledTimes(1);
    });

    // -----------------------
    // POST TESTS
    // -----------------------

    it("POST should return 401 if adminGuard throws", async () => {
        (adminGuard as any).mockRejectedValue(new Error("Unauthorized"));

        const req = new Request("http://localhost/api/device", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe("Unauthorized");
    });

    it("POST should return 400 if serialNo missing", async () => {
        (adminGuard as any).mockResolvedValue(true);

        const req = new Request("http://localhost/api/device", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Device 1",
                modelId: "65f123abc456def7890abc12",
                apiKey: "secret",
            }),
        });

        const res = await POST(req);
        const text = await res.text();

        expect(res.status).toBe(400);
        expect(text).toBe("Serial No is required");
    });

    it("POST should return 400 if apiKey missing", async () => {
        (adminGuard as any).mockResolvedValue(true);

        const req = new Request("http://localhost/api/device", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Device 1",
                modelId: "65f123abc456def7890abc12",
                serialNo: "SERIAL001",
            }),
        });

        const res = await POST(req);
        const text = await res.text();

        expect(res.status).toBe(400);
        expect(text).toBe("ApiKey is required");
    });

    it("POST should return 400 if model invalid", async () => {
        (adminGuard as any).mockResolvedValue(true);

        (prisma.deviceModel.findUnique as any).mockResolvedValue(null);

        const req = new Request("http://localhost/api/device", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Device 1",
                modelId: "65f123abc456def7890abc12",
                serialNo: "SERIAL001",
                apiKey: "secret",
            }),
        });

        const res = await POST(req);
        const text = await res.text();

        expect(res.status).toBe(400);
        expect(text).toBe("Invalid Model");
    });

    it("POST should create device if valid", async () => {
        (adminGuard as any).mockResolvedValue(true);

        (prisma.deviceModel.findUnique as any).mockResolvedValue({
            id: "65f123abc456def7890abc12",
        });

        (prisma.device.create as any).mockResolvedValue({
            id: "device1",
            name: "Device 1",
            serialNo: "SERIAL001",
            apiKey: "secret",
            modelId: "65f123abc456def7890abc12",
        });

        const req = new Request("http://localhost/api/device", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Device 1",
                modelId: "65f123abc456def7890abc12",
                serialNo: "SERIAL001",
                apiKey: "secret",
            }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(201);
        expect(json.serialNo).toBe("SERIAL001");
        expect(prisma.device.create).toHaveBeenCalledTimes(1);
    });
});
