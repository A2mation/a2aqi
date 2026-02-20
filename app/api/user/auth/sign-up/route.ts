import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { signAdminToken } from "@/lib/jwt";

const registerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            // If user signed up with Google
            if (existingUser.authProvider === "GOOGLE") {
                return NextResponse.json(
                    { message: "Email already registered with Google login" },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { message: "Email already in use" },
                { status: 400 }
            );
        }

        // 🔐 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 👤 Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                authProvider: "LOCAL",
            },
        });

        const token = signAdminToken(user.id, user.email);

        return NextResponse.json(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: "USER",
                accessToken: token,
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Invalid request" },
            { status: 400 }
        );
    }
}