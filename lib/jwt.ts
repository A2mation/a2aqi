import jwt from "jsonwebtoken";
import { ContentWriterStatus, MonitorStatus } from "@prisma/client";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export function signToken(
    id: string,
    email: string,
    status: ContentWriterStatus | MonitorStatus
) {
    return jwt.sign(
        { id: id, email, status },
        NEXTAUTH_SECRET,
        { expiresIn: "7d" }
    );
}

export function signAdminToken(
    id: string,
    email: string
) {
    return jwt.sign(
        { id: id, email },
        NEXTAUTH_SECRET,
        { expiresIn: "7d" }
    );
}