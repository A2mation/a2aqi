import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { signAdminToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        console.log(email, password)

        // const hashedPassword = await bcrypt.hash(password, 10);
        // return NextResponse.json(hashedPassword)

        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return NextResponse.json(
                { message: "Invalid credentials" },
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
        console.log(token)

        return NextResponse.json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: "ADMIN",
            accessToken: token,
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
