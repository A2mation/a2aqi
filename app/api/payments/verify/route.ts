import crypto from "crypto";
import { NextResponse } from "next/server";

import { withAuditContext } from "@/lib/withAuditContext";
import {
    prisma
} from "@/lib/prisma";
import { recordFailure } from "@/domains/payments/services/payment.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            error_code,
            error_description
        } = body;

        if (!razorpay_signature && razorpay_order_id) {
            await handlePaymentFailure(razorpay_order_id, error_code, error_description);
            return NextResponse.json({ message: "Failure recorded" });
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ message: "Missing payment data" }, { status: 400 });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET!;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
        }

        return await withAuditContext({ route: "verify-route" }, async () => {
            const payment = await prisma.payment.findUnique({
                where: { razorpayOrderId: razorpay_order_id },
                select: { status: true }
            });

            if (!payment) return NextResponse.json({ message: "Order not found" }, { status: 404 });

            // CASE 1: Webhook already finished everything
            if (payment.status === "SUCCESS") {
                return NextResponse.json({
                    success: true,
                    message: "Payment confirmed"
                });
            }

            // CASE 2: Webhook hit but failed (User should know)
            if (payment.status === "FAILED") {
                return NextResponse.json({
                    success: false,
                    message: "Payment failed during processing"
                }, { status: 400 });
            }

            // CASE 3: The "202-like" State
            // Either Webhook hasn't arrived yet, or it's currently running generateInvoice()
            return NextResponse.json({
                success: false,
                processing: true,
                message: "We've received your payment! Finalizing your setup..."
            });

        });

    } catch (error: any) {
        console.error("Verify Error:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
async function handlePaymentFailure(orderId: string, code?: string, desc?: string) {
    try {
        await recordFailure(
            orderId,
            code,
            desc
        );
    } catch (e) {
        console.error("Failed to update failure status:", e);
    }
}