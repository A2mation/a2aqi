import VendorOTPEmail from "@/emails/VendorOTP";
import DeviceCredentialsEmail from "@/emails/VendorDeviceCredentialsEmail";

import { resend } from "./server";
import AdminOrderAlertEmail from "@/emails/AdminOrderAlertEmail";
import PaymentSuccessEmail from "@/emails/PaymentSuccessEmail";

interface AdminOrderAlertPayload {
    orderId: string;
    paymentId: string;
    purchaseDate: Date;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
}

interface CustomerPaymentSuccessPayload {
    email: string;
    orderId: string;
    paymentId: string;
    customerName: string;
    shippingAddress: string;
}


export const vendorRegistrationOtpSender = async (
    email: string,
    otp: string
) => {

    const { data, error } = await resend.emails.send({
        from: 'A2AQI <onboarding@a2aqi.com>',
        to: [email],
        subject: 'Verify Your Vendor Registration',
        react: VendorOTPEmail({ otp }),
    });

    return {
        data,
        error
    }
}

export const vendorDeviceCredentialsSender = async (
    email: string,
    serialNo: string,
    apiKey: string
) => {
    const { data, error } = await resend.emails.send({
        from: 'A2AQI <support@a2aqi.com>',
        to: [email],
        subject: `Device Activated: ${serialNo} Credentials`,
        react: DeviceCredentialsEmail({
            serialNo,
            apiKey
        }),
    });

    return {
        data,
        error
    };
};

export const adminOrderAlertSender = async ({
    orderId,
    paymentId,
    purchaseDate,
    customerName,
    customerEmail,
    shippingAddress,
}: AdminOrderAlertPayload) => {

    const formattedDate = purchaseDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const { data, error } = await resend.emails.send({
        from: 'A2AQI Engine <system@a2aqi.com>',
        to: ['a2mationsolution@gmail.com'],
        subject: `🚨 [New Order] ${orderId} — Action Required for Hardware Fulfillment`,
        react: AdminOrderAlertEmail({
            orderId,
            paymentId,
            purchaseDate: formattedDate,
            customerName,
            customerEmail,
            shippingAddress
        }),
    });

    return {
        data,
        error
    };
};

export const customerPaymentSuccessSender = async ({
    email,
    orderId,
    paymentId,
    customerName,
    shippingAddress,
}: CustomerPaymentSuccessPayload) => {

    const formattedDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const { data, error } = await resend.emails.send({
        from: 'A2AQI <support@a2aqi.com>',
        to: [email],
        subject: `Payment Successful! Your A2AQI order is confirmed (${orderId})`,
        react: PaymentSuccessEmail({
            orderId,
            paymentId,
            purchaseDate: formattedDate,
            customerName,
            shippingAddress
        }),
    });

    return {
        data,
        error
    };
};