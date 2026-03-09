import { DB, prisma } from "@/lib/prisma"

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

export async function getCouponRedemptionByPayment(paymentId: string, tx?: DB) {
    const db = tx || prisma;
    return db.couponRedemption.findUnique({
        where: { paymentId }
    })
}

export async function incrementCouponUsage(couponId: string, tx?: DB) {
    const db = tx || prisma;
    return db.coupon.update({
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
}, tx?: DB) {
    const db = tx || prisma;
    return db.couponRedemption.create({
        data
    })
}