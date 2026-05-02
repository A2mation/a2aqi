import * as z from "zod"

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const vendorFormSchema = z.object({
    vendorName: z.string().min(2, "Name must be at least 2 characters"),
    mobileNumber: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number (10 digits required)"),
    email: z.email("Invalid email address"),
    address: z.string().min(5, "Address is too short"),
    gstNumber: z.string().length(15, "GST Number must be 15 characters"),
    gstCertificate: z
        .any()
        .refine((files) => files?.length === 1, "GST Certificate is required")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        ),
    agreeTerms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms",
    }),
})


const getBase64Size = (base64String: string) => {
    const padding = (base64String.match(/=/g) || []).length;
    return (base64String.length * 3) / 4 - padding;
};

export const backendVendorSchema = z.object({
    vendorName: z.string().min(2, "Name must be at least 2 characters"),
    mobileNumber: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address is too short"),
    gstNumber: z.string().length(15, "GST Number must be 15 characters"),
    // Validating the Base64 String
    gstCertificate: z
        .string()
        .min(1, "GST Certificate is required")
        .refine((base64) => {
            const size = getBase64Size(base64);
            return size <= 5000000; // 5MB limit
        }, "File size exceeds 5MB")
        .refine((base64) => {
            return /^data:image\/(jpeg|jpg|png|webp);base64,/.test(base64);
        }, "Only .jpg, .jpeg, .png, and .webp images are accepted"),
    agreeTerms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms",
    }),
});