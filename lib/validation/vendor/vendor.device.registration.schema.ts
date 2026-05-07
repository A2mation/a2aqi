import * as z from "zod";

export const vendorDeviceFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    modelId: z.string().min(1, "Model selection is required"),
    location: z.string().min(2, 'Location is required'),
    lat: z.string().min(1, "Latitude is required"),
    lng: z.string().min(1, "Longitude is required"),
    user: z.string().min(1, "User is required"),
});