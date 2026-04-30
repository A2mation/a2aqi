import * as z from "zod"


export const vendorLoginSchema = z.object({
  email: z.email("Please enter a valid business email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})
