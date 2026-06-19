import { NextResponse } from "next/server";

import { redis } from "@/lib/redis";
import { vendorOtpKey } from "@/constant/vendor.key";


export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { message: 'Email and OTP are required.', error: true },
                { status: 400 }
            );
        }

        // Fetch the stored OTP using the email-bound key string
        const redisKey = vendorOtpKey(email);
        const storedOtp = await redis.get(redisKey);

        // If no token is found, it means it either expired or was never requested
        if (!storedOtp) {
            return NextResponse.json(
                { message: 'Verification code has expired or is invalid.', error: true },
                { status: 400 }
            );
        }

        if (storedOtp !== otp.trim()) {
            return NextResponse.json(
                { message: 'Invalid verification code.', error: true },
                { status: 400 }
            );
        }

        await redis.del(redisKey);

        const resetTokenKey = `vendor:status:reset-approved:${email}`;
        await redis.set(resetTokenKey, "true", "EX", 300); // 5 mins TTL

        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully!',
        }, { status: 200 });

    } catch (error) {
        console.error("OTP Verification Error Route:", error);
        return NextResponse.json(
            { message: 'An internal error occurred during verification.', error: true },
            { status: 500 }
        );
    }
}