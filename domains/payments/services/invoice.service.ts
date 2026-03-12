import { DB, prisma } from "@/lib/prisma"

import { BillingAddress } from "../types/invoice.dto"
import { Address, Payment } from "@prisma/client"

export async function generateInvoice(payment: Payment, subscription: any, billDetails: Address, tx?: DB) {
    const db = tx || prisma

    const user = await db.user.findUnique({
        where: {
            id: payment.userId
        }, select: {
            email: true,
            name: true,
            organizationName: true,
            
        }
    })
}