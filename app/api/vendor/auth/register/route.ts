import { NextResponse } from "next/server";

import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { vendorKey } from "@/constant/vendor.key";
import { backendVendorSchema } from "@/lib/validation/vendor/Vendor.registration.schema";
import { sendMailWithOTP } from "@/services/sendMailWithOTP";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = backendVendorSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                error: true,
                message: "Validation failed",
                reason: result.error,
            }, { status: 400 });
        }

        const { email } = result.data;
        const redisKey = vendorKey(email);

        // If key exists, return early
        const existingData = await redis.get(redisKey);
        if (existingData) {
            return NextResponse.json({
                success: true,
                message: "Registration already in progress. Please verify OTP.",
                email: email
            }, { status: 200 });
        }


        const duplicateUser = await prisma.admin.findUnique({ where: { email }, select: { email: true } });
        if (duplicateUser) {
            return NextResponse.json({
                error: true,
                message: "Account already exists with this email."
            }, { status: 409 });
        }

        // Cloudinary upload
        const uploadResponse = await cloudinary.uploader.upload(result.data.gstCertificate, {
            folder: 'gst_certificates',
        });
        
        const hashedPassword = await bcrypt.hash(result.data.password, 10);
        const stagingData = {
            ...result.data,
            password: hashedPassword,
            gstCertificate: uploadResponse.secure_url,
            gstPublicId: uploadResponse.public_id
        };

        await Promise.all([
            //  Save to Redis with 5-min TTL (300 seconds)
            redis.set(redisKey, JSON.stringify(stagingData), "EX", 300),

            // Trigger Resend OTP Service
            sendMailWithOTP.vendorRegistrationOTP({
                email,
            })
        ]);

        return NextResponse.json({
            success: true,
            message: "Registration initiated. OTP sent.",
            email: email,
            expiresIn: "5 minutes"
        });

    } catch (error) {
        // console.error("Backend Error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}