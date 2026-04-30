import * as z from "zod";

export enum DeviceStatus {
    ASSIGNED = "ASSIGNED",
    UNASSIGNED = "UNASSIGNED",
}

export const vendorDeviceFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    modelId: z.string().min(1, "Model selection is required"),
    status: z.enum(DeviceStatus),
    lat: z.string().optional().default(""),
    lng: z.string().optional().default(""),
    user: z.string().optional().default(""),
}).superRefine((data, ctx) => {
    if (data.status === DeviceStatus.ASSIGNED && (!data.user || data.user.trim() === "")) {
        ctx.addIssue({
            code: "custom",
            message: "User selection is mandatory when User Mode is active",
            path: ["user"],
        });
    }
});