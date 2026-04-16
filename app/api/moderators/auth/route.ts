import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { AdminRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { signAdminToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const moderator = await prisma.admin.findUnique({
            where: {
                email,
                role: AdminRole.MODERATOR
            },
        });

        if (!moderator) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, moderator.password);
        if (!isValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }


        const token = signAdminToken(moderator.id, moderator.email);

        return NextResponse.json({
            id: moderator.id,
            name: moderator.name,
            email: moderator.email,
            role: AdminRole.MODERATOR,
            accessToken: token,
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
