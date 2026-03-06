import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { message: "Missing payment data" },
                { status: 400 }
            );
        }

        const secret = process.env.RAZORPAY_KEY_SECRET!;

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json(
                { message: "Invalid signature" },
                { status: 400 }
            );
        }

        // Check if payment already processed
        const existingPayment = await prisma.payment.findFirst({
            where: {
                razorpayPaymentId: razorpay_payment_id
            }
        });

        if (existingPayment) {
            return NextResponse.json({
                success: true,
                message: "Payment already processed"
            });
        }

        // Update payment record
        await prisma.payment.update({
            where: {
                razorpayOrderId: razorpay_order_id
            },
            data: {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: "SUCCESS",
                paidAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            message: "Payment verified"
        });

    } catch (error) {
        console.error("Verify Error:", error);

        return NextResponse.json(
            { message: "Internal Error" },
            { status: 500 }
        );
    }
}