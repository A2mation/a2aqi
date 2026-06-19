import { NextResponse } from "next/server";

import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { vendorOtpKey } from "@/constant/vendor.key";
import { sendMailWithOTP } from "@/services/sendMailWithOTP";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required', error: true },
                { status: 400 }
            );
        }

        const data = await prisma.admin.findUnique({
            where: { 
                email,
                role: 'VENDOR'
            },
            select: { id: true }
        });

        if (!data) {
            return NextResponse.json(
                { message: 'If an account with that email exists, a verification code has been sent.', error: false },
                { status: 200 }
            );
        }

        const redisKey = vendorOtpKey(email);

        // If key exists, return early
        const existingData = await redis.get(redisKey);

        if (existingData) {
            return NextResponse.json({
                success: true,
                message: 'Code already sent. Please check your email.',
                email: email
            }, { status: 200 });
        }

        const result = await sendMailWithOTP.vendorResetPasswordOTP({
            email,
        });

        if (!result) {
            return NextResponse.json(
                { message: 'Failed to send verification email', error: true },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Verification code sent successfully. Please check your email.',
            email: email
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { message: 'Invalid request body', error: true },
            { status: 400 }
        );
    }
}

