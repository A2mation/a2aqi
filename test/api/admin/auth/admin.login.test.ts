import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

vi.mock("bcryptjs", () => ({
    default: {
        compare: vi.fn(),
    },
}));

vi.mock("@/lib/jwt", () => ({
    signAdminToken: vi.fn(),
}));

import bcrypt from "bcryptjs";
import { signAdminToken } from "@/lib/jwt";
import { POST } from "@/app/api/admin/auth/sign-in/route";

describe("POST /api/admin/auth/sign-in", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 401 if admin not found", async () => {
        prismaMock.admin.findUnique.mockResolvedValue(null);

        const req = new Request("http://localhost/api/admin/auth/sign-in", {
            method: "POST",
            body: JSON.stringify({
                email: "admin@test.com",
                password: "123456",
            }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.message).toBe("Invalid credentials");
    });

    it("should return 401 if password is invalid", async () => {
        prismaMock.admin.findUnique.mockResolvedValue({
            id: "admin123",
            name: "Admin",
            email: "admin@test.com",
            password: "hashedPassword",
        } as any);

        (bcrypt.compare as any).mockResolvedValue(false);

        const req = new Request("http://localhost/api/admin/auth/sign-in", {
            method: "POST",
            body: JSON.stringify({
                email: "admin@test.com",
                password: "wrong-password",
            }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.message).toBe("Invalid credentials");
    });

    it("should return admin data + token if login successful", async () => {
        prismaMock.admin.findUnique.mockResolvedValue({
            id: "admin123",
            name: "Admin User",
            email: "admin@test.com",
            password: "hashedPassword",
        } as any);

        (bcrypt.compare as any).mockResolvedValue(true);

        (signAdminToken as any).mockReturnValue("fake-jwt-token");

        const req = new Request("http://localhost/api/admin/auth/sign-in", {
            method: "POST",
            body: JSON.stringify({
                email: "admin@test.com",
                password: "123456",
            }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.id).toBe("admin123");
        expect(json.email).toBe("admin@test.com");
        expect(json.role).toBe("ADMIN");
        expect(json.accessToken).toBe("fake-jwt-token");

        expect(signAdminToken).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if error occurs", async () => {
        prismaMock.admin.findUnique.mockRejectedValue(new Error("DB Error"));

        const req = new Request("http://localhost/api/admin/auth/sign-in", {
            method: "POST",
            body: JSON.stringify({
                email: "admin@test.com",
                password: "123456",
            }),
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.message).toBe("Internal server error");
    });
});
