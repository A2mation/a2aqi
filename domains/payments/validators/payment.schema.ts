import z from "zod";

export const createPaymentSchema = z.object({
    deviceId: z.string(),
    couponCode: z.string().optional()
});