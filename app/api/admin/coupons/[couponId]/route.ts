import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";

/**
 * GET: Fetch a single coupon by ID
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ couponId: string }> }
) {
    try {
        await adminGuard();
        const { couponId } = await params;

        if (!couponId) {
            return new NextResponse("Coupon ID is required", { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { id: couponId }
        });

        if (!coupon) {
            return new NextResponse("Coupon not found", { status: 404 });
        }

        return NextResponse.json(coupon);
    } catch (error) {
        return handleAdminError(error);
    }
}

/**
 * PATCH: Update coupon details
 */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ couponId: string }> }
) {
    try {
        await adminGuard();
        const { couponId } = await params;

        if (!couponId) {
            return new NextResponse("Coupon ID is required", { status: 400 });
        }

        const body = await req.json();
        const {
            code,
            description,
            discountType,
            discountValue,
            usage, // Maps to maxUsage
            validUntil,
            isActive
        } = body;

        // 1. Basic validation for required update fields
        if (!code) return new NextResponse("Code is required", { status: 400 });

        // 2. Check if the updated code conflicts with another coupon
        const duplicate = await prisma.coupon.findFirst({
            where: {
                code: code.toUpperCase(),
                NOT: { id: couponId }
            }
        });

        if (duplicate) {
            return new NextResponse("Coupon code already in use", { status: 400 });
        }

        // 3. Update the coupon
        const updatedCoupon = await prisma.coupon.update({
            where: { id: couponId },
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

        return NextResponse.json(updatedCoupon);
    } catch (error) {
        return handleAdminError(error);
    }
}

/**
 * DELETE: Remove a coupon
 */
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ couponId: string }> }
) {
    try {
        await adminGuard();
        const { couponId } = await params;

        if (!couponId) {
            return new NextResponse("Coupon ID is required", { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
           
            await tx.couponRedemption.deleteMany({ where: { couponId } });

            await tx.coupon.delete({
                where: { id: couponId }
            });
        });

        return new NextResponse("Coupon deleted successfully", { status: 200 });
    } catch (error) {
        return handleAdminError(error);
    }
}