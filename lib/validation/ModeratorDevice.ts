import { z } from "zod";

export const moderatordeviceSchema = z.object({
    name: z.string().min(2, "Device name must be at least 2 characters.").max(50),
    serialNo: z.string().min(5, "Serial number is required."),
    model: z.string().min(1, "Please select a model."),
    apiKey: z.string().min(4, "API Key must be at least 4 characters."),
});


export type ModeratordeviceValues = z.infer<typeof moderatordeviceSchema>;