import { prisma } from "@/lib/prisma"

export async function findCouponByCode(code: string) {
    return prisma.coupon.findUnique({
        where: { code }
    })
}

export async function getUserCouponUsage(couponId: string, userId: string) {
    return prisma.couponRedemption.count({
        where: {
            couponId,
            userId
        }
    })
}

export async function getCouponRedemptionByPayment(paymentId: string) {
    return prisma.couponRedemption.findUnique({
        where: { paymentId }
    })
}

export async function incrementCouponUsage(couponId: string) {
    return prisma.coupon.update({
        where: { id: couponId },
        data: {
            usedCount: { increment: 1 }
        }
    })
}

export async function createCouponRedemption(data: {
    couponId: string
    userId: string
    deviceId: string
    paymentId: string
    discountApplied: number
}) {
    return prisma.couponRedemption.create({
        data
    })
}