import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

/**
 * Create Invoice
 */
export async function createInvoice(
    data: Prisma.InvoiceCreateInput
) {
    return prisma.invoice.create({
        data
    })
}

/**
 * Get Invoice by ID
 */
export async function getInvoiceById(id: string) {
    return prisma.invoice.findUnique({
        where: { id },
        include: {
            payment: true,
            deviceSubscription: true,
            user: true
        }
    })
}

/**
 * Get Invoice by Payment
 */
export async function getInvoiceByPayment(paymentId: string) {
    return prisma.invoice.findUnique({
        where: { paymentId }
    })
}

/**
 * Get all invoices for a user
 */
export async function getUserInvoices(userId: string) {
    return prisma.invoice.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc"
        }
    })
}

/**
 * Update Invoice
 */
export async function updateInvoice(
    id: string,
    data: Prisma.InvoiceUpdateInput
) {
    return prisma.invoice.update({
        where: { id },
        data
    })
}

/**
 * Delete Invoice
 */
export async function deleteInvoice(id: string) {
    return prisma.invoice.delete({
        where: { id }
    })
}