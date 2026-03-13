import { prisma } from "@/lib/prisma"
import { format } from "date-fns";
import { Address, DeviceSubscription, Payment, Prisma } from "@prisma/client"

import { renderToBuffer } from '@react-pdf/renderer';
import { InvoicePDF } from "../templates/invoicePdf";
import { uploadToS3 } from "@/lib/s3";
import { createInvoice, updateInvoice } from "../repositories/invoice.repo";

export async function generateAndSaveInvoice(payment: Payment, subscription: DeviceSubscription, billDetails: Address) {

    const deviceSerialNo = await prisma.device.findUnique({
        where: {
            id: subscription.deviceId
        }, select: {
            serialNo: true
        }
    })

    const userGstNumber = await prisma.user.findUnique({
        where: {
            id: payment.userId
        }, select: {
            gstNumber: true
        }
    })

    const invoiceDetails = await generateInvoiceNumber();

    const invoiceData = {
        invoiceNumber: invoiceDetails.fullInvoiceNumber,
        date: format(payment.paidAt ?? new Date(), "dd MMM, yyyy"),
        customerName: billDetails.name,
        customerAddress: `${billDetails.street}, ${billDetails.city}, ${billDetails.state}, ${billDetails.country}, ${billDetails.zipCode}`,
        customerPhone: billDetails.phoneNumber ?? "N/A",
        customerEmail: billDetails.email ?? "N/A",
        gstNumner: userGstNumber?.gstNumber ?? "",
        items: [{
            id: deviceSerialNo?.serialNo ?? "N/A",
            description: `${subscription.planType} Subscription`,
            quantity: 1,
            rate: subscription.paidAmount
        }]
    }

    const buffer = await renderToBuffer(
        <InvoicePDF {...invoiceData} />
    );

    const invoiceInput: Prisma.InvoiceCreateInput = {
        invoiceNumber: invoiceDetails.fullInvoiceNumber,
        subtotal: payment.finalAmount - payment.finalAmount * 0.18,
        taxAmount: payment.finalAmount * 0.18,
        totalAmount: payment.finalAmount,
        financialYear: invoiceDetails.financialYear,
        seriesValue: invoiceDetails.seriesValue,
        billingName: billDetails.name,
        billingEmail: billDetails.email,
        billingAddress: invoiceData.customerAddress,
        gstNumber: userGstNumber?.gstNumber ?? '',
        status: "PAID",
        issuedAt: payment.paidAt ?? new Date(),
        user: { connect: { id: payment.userId } },
        payment: { connect: { id: payment.id } },
        address: { connect: { id: billDetails.id } },
        deviceSubscription: { connect: { id: subscription.id } }
    };

    const invoice = await createInvoice(invoiceInput)

    const folder = `invoices/${invoiceDetails.financialYear}/${invoiceDetails.fullInvoiceNumber.replace(/\//g, '-')}.pdf`;

    const s3Key = await uploadToS3(
        folder,
        buffer,
        'application/pdf'
    )


    return await updateInvoice(invoice.id, {
        s3Key,
        status: "GENERATED"
    });
    // return {
    //     s3Key: key,
    //     invoiceNumber: invoiceDetails.fullInvoiceNumber
    // }
}

async function generateInvoiceNumber() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate the Indian Financial Year (April to March)
    const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
    const endYear = startYear + 1;

    // This creates the "25-26" or "26-27" string
    const fyString = `${startYear.toString().slice(-2)}-${endYear.toString().slice(-2)}`;

    // Query using the dedicated financialYear column
    // We order by seriesValue desc to get the highest number in that year
    const lastInvoice = await prisma.invoice.findFirst({
        where: {
            financialYear: fyString,
        },
        orderBy: {
            seriesValue: 'desc',
        },
        select: {
            seriesValue: true,
        },
    });

    // Increment the series value
    // If no invoice exists for this year, start at 1
    const nextNumber = (lastInvoice?.seriesValue ?? 0) + 1;

    return {
        fullInvoiceNumber: `A2AQI/${fyString}/${nextNumber}`,
        seriesValue: nextNumber,
        financialYear: fyString
    };
}

