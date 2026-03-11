import * as z from "zod";

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const profileSchema = z.object({
    name: z.string().min(2, "Name is required"),
    recoveryEmail: z.email().optional().or(z.literal("")),
    phoneNumber: z.string().optional(),
    accountType: z.enum(["PERSONAL", "ORGANIZATION"]),
    organizationName: z.string().optional(),
    gstNumber: z.string().optional(),
    billingAddressId: z.string().optional(),
}).refine(
    (data) => {
        if (data.accountType === "ORGANIZATION") {

            if (!data.organizationName) return false;

            if (data.gstNumber && !gstRegex.test(data.gstNumber)) return false;
        }
        return true;
    },
    {
        message: "Enter a valid GST Number",
        path: ["gstNumber"],
    },

);

