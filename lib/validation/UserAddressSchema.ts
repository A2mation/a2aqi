import * as z from "zod";
import { AddressType } from "@prisma/client";

export const addressSchema = z.object({
    name: z
        .string()
        .min(2, "Name is too small")
        .max(100, "Name is too long"),

    email: z
        .email()
        .min(2, "Email is too short")
        .max(100, "Email is too long"),

    phoneNumber: z
        .string()
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),

    zipCode: z
        .string()
        .length(6, "Pincode must be exactly 6 digits")
        .regex(/^[0-9]+$/, "Pincode must contain only numbers"),

    type: z.enum(AddressType),

    street: z
        .string()
        .min(5, "Street address is too short")
        .max(100, "Street address is too long"),

    city: z
        .string()
        .min(2, "City name is required"),

    state: z
        .string()
        .min(2, "State name is required"),

    isDefault: z
        .boolean()
        .default(true),
});

export type AddressFormValues = z.infer<typeof addressSchema>;