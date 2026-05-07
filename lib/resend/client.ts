import VendorOTPEmail from "@/emails/VendorOTP";
import DeviceCredentialsEmail from "@/emails/VendorDeviceCredentialsEmail";

import { resend } from "./server";


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