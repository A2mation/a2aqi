import * as z from "zod";
import { DeviceSubscriptionStatus, SubscriptionDuration } from "@prisma/client";

export const DeviceSubscriptionSchema = z.object({
    serialNo: z.string().min(1, "Device ID is required"),
    email: z.string().min(1, "User ID is required"),
    startDate: z.coerce.date().refine((val) => !!val, {
        message: "Start date is required",
    }),
    endDate: z.coerce.date().refine((val) => !!val, {
        message: "End date is required",
    }),
    paidAmount: z.coerce.number(),
    planType: z.enum(SubscriptionDuration),
    status: z.enum(DeviceSubscriptionStatus),
    autoRenew: z.boolean().default(false),
    adminModified: z.boolean().default(true),
    notes: z.string().optional(),
});