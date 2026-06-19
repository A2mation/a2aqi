import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required.", error: true },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters long.", error: true },
                { status: 400 }
            );
        }

        const resetTokenKey = `monitor:status:reset-approved:${email}`;
        const isApproved = await redis.get(resetTokenKey);

        if (!isApproved) {
            return NextResponse.json(
                { message: "Unauthorized request. Please verify your OTP code first.", error: true },
                { status: 403 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.monitor.update({
            where: { email },
            data: {
                password: hashedPassword,
            },
        });

        await redis.del(resetTokenKey);

        return NextResponse.json({
            success: true,
            message: "Your password has been reset successfully.",
        }, { status: 200 });

    } catch (error) {
        console.error("Password Reset Error Route:", error);
        return NextResponse.json(
            { message: "An internal error occurred during password reset.", error: true },
            { status: 500 }
        );
    }
}