import { DB } from "@/lib/prisma"
import { createPayment, updateLockPaymentTable, updatePaymentFailed, updatePaymentPending, updatePaymentSuccess } from "../repositories/payment.repo"
import { getPricingPlanById } from "../repositories/pricing-plan.repo"
import { validateCoupon } from "./coupon.service"
import { razorpay } from "@/lib/razorpay"

export async function createOrder(
    userId: string,
    deviceId: string,
    pricingPlanId: string,
    couponCode?: string
) {

    let discount = 0
    let couponId: string | null = null
    let finalAmount: number = 0

    const plan = await getPricingPlanById(pricingPlanId)

    if (!plan) {
        throw new Error(
            "Plan not found"
        )
    }

    finalAmount = plan.price;

    if (couponCode) {

        const result = await validateCoupon(
            couponCode,
            userId,
            deviceId,
            plan.price
        )

        discount = result.discount
        couponId = result.coupon.id
        finalAmount = result.finalAmount
    }

    const order = await razorpay.orders.create({
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    })

    await createPayment({
        userId:  userId ,
        deviceId: deviceId,
        pricingPlanId,

        amount: plan.price,
        discountAmount: discount,
        finalAmount,

        razorpayOrderId: order.id,
        status: "PENDING",

        couponId: couponId || undefined,
    })

    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        // paymentId: payment.id,
        discount
    }


}


export async function completePayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpay_signature: string,
    tx?: DB
) {
    return await updatePaymentSuccess(
        razorpayOrderId,
        razorpayPaymentId,
        razorpay_signature,
        tx
    );
}

export async function changePaymentStatusToPending(
    razorpayOrderId: string,
    tx?: DB
) {
    return await updatePaymentPending(
        razorpayOrderId,
        tx
    );
}

/**
 * Orchestrates the failure flow.
 * Records the failure state in the database.
 */
export async function recordFailure(
    razorpayOrderId: string,
    code?: string,
    desc?: string,
    tx?: DB
) {
    return await updatePaymentFailed(
        razorpayOrderId,
        code || "UNKNOWN",
        desc || "Transaction declined",
        tx
    );
}

/**
 * Atomic State Locking. 
 * This is a "Check-and-Set" strategy where the first process to
 * hit the database "claims" the right to process the payment.
 */
export async function lockPaymentForProcessing(razorpayOrderId: string, tx?: DB) {
    const STALE_LOCK_TIME = new Date(Date.now() - 5 * 60 * 1000);
    return await updateLockPaymentTable(razorpayOrderId, STALE_LOCK_TIME, tx)
}