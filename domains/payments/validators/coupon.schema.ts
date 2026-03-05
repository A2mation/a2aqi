import * as z from "zod"

export const applyCouponSchema = z.object({
    code: z.string().min(3),
    userId: z.string(),
    deviceId: z.string(),
    amount: z.number()
})