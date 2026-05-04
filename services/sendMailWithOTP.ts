import { redis } from "@/lib/redis";
import { generateOTP } from "@/utils/otp";
import { vendorOtpKey } from "@/constant/vendor.key";
import { vendorRegistrationOtpSender } from "@/lib/resend/client";

export const sendMailWithOTP = {
    vendorRegistrationOTP: async ({ email }: { email: string }) => {
        const otp = generateOTP();
        const otpString = otp.toString();
        const redisKey = vendorOtpKey(otpString);

        const [_, mailResponse] = await Promise.all([
            // Save to Redis (5 mins TTL)
            redis.set(redisKey, email, "EX", 300),

            // Send Email via Resend
            vendorRegistrationOtpSender(email, otpString)
        ]);

        if (mailResponse?.error) {
            throw new Error('Failed to send verification email');
        }

        return {
            success: true
        };
    }
};