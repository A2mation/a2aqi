import { MonitorStatus, MonitorTag } from "@prisma/client";
import * as z from "zod";

export const MonitorDetailsFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
    status: z.enum(MonitorStatus),
    tag: z.enum(MonitorTag),
    deviceIds: z.array(z.string()).default([]),
});