import { createPayment } from "../repositories/payment.repo"
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
        amount: finalAmount * 100,
        currency: "INR"
    })

    const payment = await createPayment({
        user: { connect: { id: userId } },
        device: { connect: { id: deviceId } },
        pricingPlan: { connect: { id: pricingPlanId } },

        amount: plan.price,
        discountAmount: discount,
        finalAmount,

        razorpayOrderId: order.id,
        status: "PENDING",

        coupon: couponId
            ? { connect: { id: couponId } }
            : undefined
    })

    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        // paymentId: payment.id,
        discount
    }
}