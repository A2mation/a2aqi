import { DB, prisma } from "@/lib/prisma"
import { PaymentStatus } from "@prisma/client"
import { CreatePaymentDTO } from "../types/payment.dto";

export async function createPayment(data: CreatePaymentDTO) {

    await prisma.payment.updateMany({
        where: {
            deviceId: data.deviceId,
            userId: data.userId,
            pricingPlanId: data.pricingPlanId,
            status: "PENDING",
            NOT: { razorpayOrderId: data.razorpayOrderId }
        },
        data: {
            status: "FAILED"
        }
    })

    return await prisma.payment.create({
        data: {
            userId: data.userId,
            deviceId: data.deviceId,
            pricingPlanId: data.pricingPlanId,
            couponId: data.couponId,
            amount: data.amount,
            discountAmount: data.discountAmount,
            finalAmount: data.finalAmount,
            currency: data.currency || "INR",
            razorpayOrderId: data.razorpayOrderId,
            status: "PENDING",
            metadata: data.metadata || {},
        },
    });

}

export async function updatePayment(id: string, data: any) {
    return prisma.payment.update({
        where: { id },
        data
    })
}

export async function updatePaymentSuccess(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpay_signature: string,
    tx?: DB
) {
    const db = tx || prisma;
    
    return db.payment.update({
        where: {
            razorpayOrderId,
            status: PaymentStatus.PROCESSING
        },
        data: {
            status: "SUCCESS",
            razorpayPaymentId,
            razorpaySignature: razorpay_signature,
            paidAt: new Date()
        }
    })
}

export async function updatePaymentFailed(
    razorpayOrderId: string,
    errorCode: string,
    errorDesc: string,
    tx?: DB
) {
    const db = tx || prisma;
    return await db.payment.update({
        where: { razorpayOrderId },
        data: {
            status: "FAILED",
            metadata: {
                errorCode: errorCode || "UNKNOWN",
                errorDesc: errorDesc || "No description provided",
                failedAt: new Date().toISOString(),
            },
        },
    });
}

export async function updatePaymentPending(
    razorpayOrderId: string,
    tx?: DB
) {
    const db = tx || prisma;
    return await db.payment.update({
        where: { razorpayOrderId },
        data: {
            status: "PENDING",
        },
    });
}

export async function updateLockPaymentTable(razorpayOrderId: string, STALE_LOCK_TIME: Date, tx?: DB) {
    const db = tx || prisma;
    try {
        return await db.payment.update({
            where: {
                razorpayOrderId: razorpayOrderId,
                OR: [
                    {
                        status: "PENDING"
                    }, {
                        status: "PROCESSING",
                        updatedAt: {
                            lt: STALE_LOCK_TIME
                        }
                    }
                ]
            },
            data: {
                status: "PROCESSING",
                updatedAt: new Date(),
            },
            select: {
                id: true,
                status: true
            }
        });
    } catch (error: any) {
        // If P2025, it means status is already PROCESSING or SUCCESS
        return null;
    }
}