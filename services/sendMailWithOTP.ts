import { redis } from "@/lib/redis";
import { generateOTP } from "@/utils/otp";
import { vendorOtpKey } from "@/constant/vendor.key";
import { monitorResetPasswordOtp, userResetPasswordOtp, vendorRegistrationOtpSender, vendorResetPasswordOtp } from "@/lib/resend/client";
import { UserOtpKey } from "@/constant/user.key";
import { MonitorOtpKey } from "@/constant/monitor.key";

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
    },

    userResetPasswordOTP: async ({ email }: { email: string }) => {
        const otp = generateOTP();
        const otpString = otp.toString();
        const redisKey = UserOtpKey(email);

        const [_, mailResponse] = await Promise.all([
            // Save to Redis (5 mins TTL)
            redis.set(redisKey, otpString, "EX", 300),

            // Send Email via Resend
            userResetPasswordOtp(email, otpString)
        ]);

        if (mailResponse?.error) {
            throw new Error('Failed to send verification email');
        }

        return {
            success: true
        };
    },

    monitorResetPasswordOTP: async ({ email }: { email: string }) => {
        const otp = generateOTP();
        const otpString = otp.toString();
        const redisKey = MonitorOtpKey(email);

        const [_, mailResponse] = await Promise.all([
            // Save to Redis (5 mins TTL)
            redis.set(redisKey, otpString, "EX", 300),

            // Send Email via Resend
            monitorResetPasswordOtp(email, otpString)
        ]);

        if (mailResponse?.error) {
            throw new Error('Failed to send verification email');
        }

        return {
            success: true
        };
    },

    vendorResetPasswordOTP: async ({ email }: { email: string }) => {
        const otp = generateOTP();
        const otpString = otp.toString();
        const redisKey = vendorOtpKey(email);
        const [_, mailResponse] = await Promise.all([
            // Save to Redis (5 mins TTL)
            redis.set(redisKey, otpString, "EX", 300),

            // Send Email via Resend
            vendorResetPasswordOtp(email, otpString)
        ]);

        if (mailResponse?.error) {
            throw new Error('Failed to send verification email');
        }

        return {
            success: true
        };
    },


};