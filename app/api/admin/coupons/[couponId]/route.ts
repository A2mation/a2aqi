import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";
import { withAuditContext } from "@/lib/withAuditContext";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

        return NextResponse.json(coupon).headers.set('Cache-Control', 'no-store, max-age=0');
    } catch (error) {
        return handleAdminError(error);
    }
}

/**
 * PATCH: Update coupon details
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ couponId: string }> }
) {
    try {
        const { admin } = await adminGuard();

        const { couponId } = await params;

        if (!couponId) {
            return new NextResponse("Coupon ID is required", { status: 400 });
        }

        const body = await request.json();
        const {
            code,
            description,
            discountType,
            discountValue,
            usage, // Maps to maxUsage
            validUntil,
            isActive
        } = body;


        if (!code) return new NextResponse("Code is required", { status: 400 });


        const duplicate = await prisma.coupon.findFirst({
            where: {
                code: code.toUpperCase(),
                NOT: { id: couponId }
            }
        });

        if (duplicate) {
            return new NextResponse("Coupon code already in use", { status: 400 });
        }

        return await withAuditContext({
            userId: admin.id,
            isAdmin: true,
            role: "ADMIN",
            ip: request.headers.get("x-forwarded-for") || "unknown",
            route: "Update-Coupons-Details"
        }, async () => {

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
            return NextResponse.json(updatedCoupon).headers.set('Cache-Control', 'no-store, max-age=0');
        })

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
        const { admin } = await adminGuard();
        const { couponId } = await params;

        if (!couponId) {
            return new NextResponse("Coupon ID is required", { status: 400 });
        }

        return await withAuditContext({
            userId: admin.id,
            isAdmin: true,
            role: "ADMIN",
            ip: req.headers.get("x-forwarded-for") || "unknown",
            route: "Delete-Coupons-with-Coupon-Redemption"
        }, async () => {

            await prisma.$transaction(async (tx) => {

                await tx.couponRedemption.deleteMany({ where: { couponId } });

                await tx.coupon.delete({
                    where: { id: couponId }
                });
            });

            return new NextResponse("Coupon deleted successfully", { status: 200 }).headers.set('Cache-Control', 'no-store, max-age=0');
        })
    } catch (error) {
        return handleAdminError(error);
    }
}