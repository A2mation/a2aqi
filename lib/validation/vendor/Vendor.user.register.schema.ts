import * as z from "zod";

/**
 * Validates the GSTIN checksum (15th digit)
 * Logic: Modified Modulo 36 Checksum
 */
const validateGSTChecksum = (gst: string) => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let sum = 0;
    for (let i = 0; i < gst.length - 1; i++) {
        let code = chars.indexOf(gst[i]);
        let factor = (i % 2 === 0) ? 1 : 2;
        let digit = code * factor;
        sum += Math.floor(digit / 36) + (digit % 36);
    }
    const checkCode = (36 - (sum % 36)) % 36;
    return gst[14] === chars[checkCode];
};

export const userRegisterFormSchema = z
    .object({
        name: z.string().min(1, "Full name is required"),
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        phoneNumber: z.string().min(10, "Valid phone number is required"),
        accountType: z.enum(["PERSONAL", "ORGANIZATION"]),
        organizationName: z.string().optional(),
        gstNumber: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.accountType === "ORGANIZATION") {
            if (!data.organizationName || data.organizationName.length < 10) {
                ctx.addIssue({
                    code: "custom",
                    message: "Valid Organization Name (min 10 chars) is required",
                    path: ["organizationName"],
                });
            }

            const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

            if (!data.gstNumber || data.gstNumber.length !== 15) {
                ctx.addIssue({
                    code: "custom",
                    message: "GST number must be exactly 15 characters",
                    path: ["gstNumber"],
                });
            } else if (!gstRegex.test(data.gstNumber)) {
                ctx.addIssue({
                    code: "custom",
                    message: "Invalid GST format",
                    path: ["gstNumber"],
                });
            } else if (!validateGSTChecksum(data.gstNumber.toUpperCase())) {
                ctx.addIssue({
                    code: "custom",
                    message: "Invalid GST checksum (Check digit mismatch)",
                    path: ["gstNumber"],
                });
            }
        }
    });

export type UserRegisterFormValues = z.infer<typeof userRegisterFormSchema>;