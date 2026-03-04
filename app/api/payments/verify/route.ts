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

        const secret = process.env.RAZORPAY_KEY_SECRET!;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
        }

        // 3. SUCCESS: Update your database (Prisma)
        // Example: Mark an invoice as PAID or create a Subscription
        /*
        await prisma.subscription.create({
            data: {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                status: "ACTIVE",
                // ... other details
            }
        });
        */

        return NextResponse.json({ success: true, message: "Payment verified" });

    } catch (error) {
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}