import crypto from "crypto";

/**
 * Generates a cryptographically secure 6-digit OTP string.
 * 
 * Generates 6 Digit OTP.
 */
export const generateOTP = (): string => {
    // Generates a random number between 100,000 and 999,999 
    return crypto.randomInt(100000, 1000000).toString();
};