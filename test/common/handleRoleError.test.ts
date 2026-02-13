import { describe, it, expect } from "vitest";
import { handleRoleError } from "@/lib/handleRoleError";
import { ROLE } from "@/types/type";

describe("handleRoleError()", () => {
    it("should return 401 for ADMIN ACCESS ONLY ROUTE", async () => {
        const err = new Error("ADMIN ACCESS ONLY ROUTE");

        const res = handleRoleError(err, ROLE.ADMIN);

        expect(res.status).toBe(401);

        const json = await res.json();
        expect(json.error).toBe("ADMIN ACCESS ONLY ROUTE");
    });

    it("should return 401 for USER ACCESS ONLY ROUTE", async () => {
        const err = new Error("USER ACCESS ONLY ROUTE");

        const res = handleRoleError(err, ROLE.USER);

        expect(res.status).toBe(401);

        const json = await res.json();
        expect(json.error).toBe("USER ACCESS ONLY ROUTE");
    });

    it("should return 401 for WRITER ACCESS ONLY ROUTE", async () => {
        const err = new Error("WRITER ACCESS ONLY ROUTE");

        const res = handleRoleError(err, ROLE.WRITER);

        expect(res.status).toBe(401);

        const json = await res.json();
        expect(json.error).toBe("WRITER ACCESS ONLY ROUTE");
    });

    it("should return 401 for Session not found", async () => {
        const err = new Error("Session not found");

        const res = handleRoleError(err, ROLE.ADMIN);

        expect(res.status).toBe(401);

        const json = await res.json();
        expect(json.error).toBe("Session not found");
    });

    it("should return 401 for Unauthorized", async () => {
        const err = new Error("Unauthorized");

        const res = handleRoleError(err, ROLE.ADMIN);

        expect(res.status).toBe(401);

        const json = await res.json();
        expect(json.error).toBe("Unauthorized");
    });

    it("should return 500 for unknown errors", async () => {
        const err = new Error("Something went wrong");

        const res = handleRoleError(err, ROLE.ADMIN);

        expect(res.status).toBe(500);

        const json = await res.json();
        expect(json.error).toBe("Something went wrong");
    });

    it("should return 500 if err has no message", async () => {
        const err = {};

        const res = handleRoleError(err, ROLE.ADMIN);

        expect(res.status).toBe(500);

        const json = await res.json();
        expect(json.error).toBe("Internal server error");
    });
});
