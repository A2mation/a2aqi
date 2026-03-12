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
import { UserBillingAddressService } from "@/domains/users/services/user.billing.address.service";
import { DeviceSubscription, Payment } from "@prisma/client";

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

                let userId: string = "";
                let transactionResult: { payment: Payment; subscription: DeviceSubscription } | null = null;

                try {
                    transactionResult = await prisma.$transaction(async (tx) => {
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

                        // Return both to be used for invoice generation
                        return { payment, subscription };
                    });


                } catch (txError) {
                    console.error("Transaction Error:", txError);
                    await changePaymentStatusToPending(paymentData.order_id);
                    throw txError;
                }

                // Invoice Generation
                if (transactionResult) {
                    const { payment, subscription } = transactionResult;
                    const userId = payment.userId;

                    const billingAdsOBJ = new UserBillingAddressService();
                    const userBillingAddress = await billingAdsOBJ.getPrimaryBillingAddress(userId);

                    if (userBillingAddress) {
                        await generateInvoice(payment, subscription, userBillingAddress);
                    }

                    return new Response("SUCCESS_COMPLETE", { status: 200 });
                }

                return new Response("FAILED", { status: 500 });
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