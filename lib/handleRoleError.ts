import { ROLE } from "@/types/type";
import { NextResponse } from "next/server";

export function handleRoleError(err: any, role: ROLE) {
    const msg = err?.message ?? "Internal server error";

    const status =
        msg === `${role} ACCESS ONLY ROUTE` ? 401 :
            msg === "Session not found" ? 401 :
                msg === "Unauthorized" ? 401 :
                    500;

    return NextResponse.json({ error: msg }, { status });
}


export const handleAdminError = (err: any) => handleRoleError(err, ROLE.ADMIN);
export const handleUserError = (err: any) => handleRoleError(err, ROLE.USER);
export const handleWriterError = (err: any) => handleRoleError(err, ROLE.WRITER);
