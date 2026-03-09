import { DB, prisma } from "@/lib/prisma"

export async function generateInvoice(payment: any, subscription: any, tx: DB) {
    const db = tx || prisma

    return db.invoice.create({
        data: {
            invoiceNumber: `INV-${Date.now()}`,
            userId: payment.userId,
            paymentId: payment.id,
            deviceSubscriptionId: subscription.id,
            subtotal: payment.amount,
            taxAmount: 0,
            totalAmount: payment.finalAmount
        }
    })
}