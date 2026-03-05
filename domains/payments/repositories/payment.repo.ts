import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// domains/payments/repositories/payment.repo.ts

export async function createPayment(data: Prisma.PaymentCreateInput) {
    try {
        return await prisma.payment.upsert({
            where: { razorpayOrderId: data.razorpayOrderId },
            update: {
                amount: data.amount,
                finalAmount: data.finalAmount,
            },
            create: data,
        });
    } catch (error: any) {
        // If P2002 happens despite upsert, someone else just created it.
        if (error.code === 'P2002') {
            return await prisma.payment.findUnique({
                where: { razorpayOrderId: data.razorpayOrderId }
            });
        }
        throw error;
    }
}

export async function updatePayment(id: string, data: any) {
    return prisma.payment.update({
        where: { id },
        data
    })
}

export async function updatePaymentSuccess(
    razorpayOrderId: string,
    razorpayPaymentId: string
) {
    return prisma.payment.update({
        where: { razorpayOrderId },
        data: {
            status: "SUCCESS",
            razorpayPaymentId,
            paidAt: new Date()
        }
    })
}