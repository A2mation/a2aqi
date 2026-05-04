import { vendorKey, vendorOtpKey } from "@/constant/vendor.key";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { otp, email } = await req.json();

        if (!otp || !email) {
            return NextResponse.json(
                { message: "OTP and Email are required" },
                { status: 400 }
            );
        }

        // Verify OTP from Redis
        const storedEmail = await redis.get(vendorOtpKey(otp.toString()));

        // Ensure OTP belongs to the email provided
        if (!storedEmail || storedEmail !== email) {
            return NextResponse.json(
                { message: "Invalid or expired OTP" },
                { status: 401 }
            );
        }

        const rawData = await redis.get(vendorKey(email));
        if (!rawData) {
            return NextResponse.json(
                { message: "Registration session expired. Please start over." },
                { status: 404 }
            );
        }

        const stagingData = JSON.parse(rawData);

        const admin = await prisma.admin.create({
            data: {
                email: stagingData.email,
                name: stagingData.vendorName,
                password: stagingData.password,
                gstNumber: stagingData.gstNumber,
                gstCertificate: stagingData.gstCertificate,
                gstPublicId: stagingData.gstPublicId,
                phoneNumber: stagingData.mobileNumber,
                address: stagingData.address,
                role: "VENDOR",
                status: 'PENDING'
            }
        });

        // Cleanup Redis
        await Promise.all([
            redis.del(vendorKey(email)),
            redis.del(vendorOtpKey(otp.toString()))
        ]);

        return NextResponse.json({
            success: true,
            message: "Account created successfully. Please wait for admin approval.",
            data: { email: admin.email }
        }, { status: 200 });

    } catch (error) {
        console.error("OTP_VERIFICATION_ERROR", error);
        return NextResponse.json(
            { message: "Internal server error", error: true },
            { status: 500 }
        );
    }
}