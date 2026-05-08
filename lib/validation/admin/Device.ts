import * as z from "zod";

import { DeviceStatus, Status } from "@prisma/client";

export const deviceFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    serialNo: z.string().min(1, "Serial number is required"),
    modelId: z.string().min(1, "Model selection is required"),
    apiKey: z.string().min(1, "API Key is required"),
    status: z.enum(DeviceStatus),
    state: z.enum(Status),
    assignedAt: z.coerce.date().optional(),
    isUserMode: z.boolean().default(false),
    lat: z.string().optional().default(""),
    lng: z.string().optional().default(""),
    user: z.string().optional().default(""),
}).superRefine((data, ctx) => {
    if (data.isUserMode && data.status == DeviceStatus.ASSIGNED && (!data.user || data.user.trim() === "")) {
        ctx.addIssue({
            code: "custom",
            message: "User selection is mandatory when User Mode is active",
            path: ["user"],
        });
    }
});