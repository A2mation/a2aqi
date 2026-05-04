import VendorOTPEmail from "@/emails/VendorOTP";
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