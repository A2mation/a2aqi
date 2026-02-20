import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { signAdminToken } from "@/lib/jwt";
import { AuthProvider } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        // console.log(email, password)

        // const hashedPassword = await bcrypt.hash(password, 10);
        // return NextResponse.json(hashedPassword)

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                authProvider: true
            }
        });
        // console.log(user)

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (user.authProvider !== AuthProvider.LOCAL) {
            return NextResponse.json(
                { message: "Please login using Google" },
                { status: 400 }
            );
        }

        if (!user.password) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = signAdminToken(user.id, user.email);
        console.log(token)

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: "USER",
            accessToken: token,
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
