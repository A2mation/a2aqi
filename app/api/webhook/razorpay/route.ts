import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { withAuditContext } from "@/lib/withAuditContext";
import { activateSubscription } from "@/domains/payments/services/subscription.service";
import { generateInvoice } from "@/domains/payments/services/invoice.service";
import { redeemCoupon } from "@/domains/payments/services/coupon.service";
import {
    changePaymentStatusToPending,
    completePayment,
    lockPaymentForProcessing, 
    recordFailure
} from "@/domains/payments/services/payment.service";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");


        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(body)
            .digest("hex");

        if (expected !== signature) {
            return new Response("Invalid signature", { status: 400 });
        }

        const event = JSON.parse(body);


        if (event.event === "payment.captured" || event.event === "order.paid") {
            const paymentData = event.payload.payment.entity;

            return await withAuditContext({
                ip: req.headers.get("x-forwarded-for") || "unknown",
                route: "razorpay-webhook"
            }, async () => {

                const lock = await lockPaymentForProcessing(paymentData.order_id);
                console.log("Webhook Route Log: ", lock)

                if (!lock) return new Response("OK", { status: 200 });

                try {
                    const result = await prisma.$transaction(async (tx) => {

                        const payment = await completePayment(
                            paymentData.order_id,
                            paymentData.id,
                            expected,
                            tx
                        );

                        if (payment.couponId) {
                            await redeemCoupon(payment, tx);
                        }

                        const subscription = await activateSubscription(payment, tx);

                        await generateInvoice(payment, subscription, tx);

                        return "SUCCESS_COMPLETE";
                    });

                    return new Response(result, { status: 200 });

                } catch (txError) {
                    console.log("Error", txError)
                    // This allows a retry from Razorpay to succeed later
                    await changePaymentStatusToPending(
                        paymentData.order_id
                    )
                    throw txError;
                }
            });
        }

        // 3. Handle Failure Events
        if (event.event === "payment.failed") {
            const { order_id, error_code, error_description } = event.payload.payment.entity;

            await withAuditContext({ route: "razorpay-webhook-fail" }, async () => {
                await recordFailure(order_id, error_code, error_description);
            });

            return new Response("Handled failure", { status: 200 });
        }

        return new Response("Ignored", { status: 200 });

    } catch (error: any) {
        // P2025/P2028 handling just in case, though External Lock prevents most of these
        if (error.code === 'P2028' || error.code === 'P2025') {
            return new Response("Concurrency handled", { status: 200 });
        }

        console.error("Critical Webhook Error:", error);
        // Prevent server crash
        return new Response("Internal Processing Error", { status: 202 });
    }
}