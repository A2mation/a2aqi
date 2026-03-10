import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";

export async function GET() {
    try {
        await adminGuard();

        // Fetch coupons ordered by newest first
        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(coupons);
    } catch (error) {
        return handleAdminError(error);
    }
}

export async function POST(request: Request) {
    try {
        await adminGuard();

        const body = await request.json();
        const { 
            code, 
            description, 
            discountType, 
            discountValue, 
            usage, 
            validUntil, 
            isActive 
        } = body;

        // 1. Validation
        if (!code) {
            return new NextResponse("Coupon code is required", { status: 400 });
        }

        if (!discountValue || discountValue <= 0) {
            return new NextResponse("Valid discount value is required", { status: 400 });
        }

        if (!validUntil) {
            return new NextResponse("Expiry date is required", { status: 400 });
        }

        // 2. Check for existing code (Codes should be unique)
        const existingCoupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (existingCoupon) {
            return new NextResponse("A coupon with this code already exists", { status: 400 });
        }

        // 3. Create the Coupon
        const newCoupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                description,
                discountType,
                discountValue: Number(discountValue),
                maxUsage: usage ? Number(usage) : null,
                validUntil: new Date(validUntil),
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(newCoupon, { status: 201 });

    } catch (error) {
        return handleAdminError(error);
    }
}