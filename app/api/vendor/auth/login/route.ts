import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { AdminRole, AdminStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { signAdminToken } from "@/lib/jwt";
import { vendorLoginSchema } from "@/lib/validation/vendor/Vendor.login.schema";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const result = vendorLoginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: true,
                    message: "Validation failed",
                    reason: result.error,
                },
                {
                    status: 400,
                },
            );
        }

        const { email, password } = result.data;

        const admin = await prisma.admin.findUnique({
            where: {
                email,
                role: AdminRole.VENDOR
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                status: true
            }
        });

        if (!admin) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (admin.status != AdminStatus.ACTIVE) {
            return NextResponse.json(
                {
                    error: true,
                    reason: AdminStatus,
                    message: "Account is " + admin.status.toLowerCase()
                },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = signAdminToken(admin.id, admin.email);

        return NextResponse.json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            accessToken: token,
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
