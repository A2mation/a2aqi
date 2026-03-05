import { calculateDiscount } from "@/utils/discount"
import { createCouponRedemption, findCouponByCode, getCouponRedemptionByPayment, getUserCouponUsage, incrementCouponUsage } from "../repositories/coupon.repo"
import { Payment } from "@prisma/client"

export async function validateCoupon(
    code: string,
    userId: string,
    deviceId: string,
    amount: number
) {

    const coupon = await findCouponByCode(code)

    if (!coupon) {
        throw new Error("Coupon not found")
    }

    if (!coupon.isActive) {
        throw new Error("Coupon is inactive")
    }

    const now = new Date()

    if (now < coupon.validFrom || now > coupon.validUntil) {
        throw new Error("Coupon expired")
    }

    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
        throw new Error("Coupon usage limit reached")
    }

    const userUsage = await getUserCouponUsage(coupon.id, userId)

    if (
        coupon.maxUsagePerUser &&
        userUsage >= coupon.maxUsagePerUser
    ) {
        throw new Error("Coupon already used by this user")
    }

    const discount = calculateDiscount(amount, coupon)

    return {
        coupon,
        discount,
        finalAmount: amount - discount
    }
}

export async function redeemCoupon(payment: Payment) {

    if (!payment.couponId) return

    const existing = await getCouponRedemptionByPayment(payment.id)

    if (existing) return

    await createCouponRedemption({
        couponId: payment.couponId,
        userId: payment.userId,
        deviceId: payment.deviceId,
        paymentId: payment.id,
        discountApplied: payment.discountAmount ?? 0
    })

    await incrementCouponUsage(payment.couponId)
}