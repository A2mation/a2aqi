import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { withAuditContext } from "@/lib/withAuditContext"
import { activateSubscription } from "@/domains/payments/services/subscription.service"
import { generateInvoice } from "@/domains/payments/services/invoice.service"
import { updatePaymentSuccess } from "@/domains/payments/repositories/payment.repo"
import { redeemCoupon } from "@/domains/payments/services/coupon.service"

export async function POST(req: Request) {

    const body = await req.text()

    const signature = req.headers.get("x-razorpay-signature")

    const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest("hex")

    if (expected !== signature) {
        return new Response("Invalid signature", { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === "payment.captured") {

        const paymentData = event.payload.payment.entity

        return withAuditContext(
            { route: "razorpay-webhook" },
            async () => {

                const payment = await updatePaymentSuccess(
                    paymentData.order_id,
                    paymentData.id
                )

                await redeemCoupon(payment)

                const subscription = await activateSubscription(payment)

                await generateInvoice(payment, subscription)

                return new Response("ok")

            }
        )
    }

    return new Response("ignored")
}