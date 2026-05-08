import { AccountType, Status } from "@prisma/client";
import * as z from "zod"

export const UserFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
    accountType: z.enum(AccountType),
    status: z.enum(Status),
    organizationName: z.string().optional(),
    gstNumber: z.string().optional(),
}).refine((data) => {
    if (data.accountType === AccountType.ORGANIZATION) {
        return !!data.organizationName && !!data.gstNumber;
    }
    return true;
}, {
    message: "Organization Name and GST Number are required for Organization accounts",
    path: ["organizationName"],
});