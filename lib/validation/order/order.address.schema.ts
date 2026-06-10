import * as z from 'zod'

export const orderAddressSchema = z.object({
    fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
    phone: z.string().regex(/^[6-9]\d{9}$/, { message: "Please enter a valid 10-digit Indian phone number." }),
    email: z.email().min(5, { message: "Please enter your email address." }),
    street: z.string().min(5, { message: "Please enter your detailed street name." }),
    addressLine: z.string().min(5, { message: "Please enter your detailed shipping address." }),
    city: z.string().min(2, { message: "City name is required." }),
    state: z.string().min(2, { message: "State name is required." }),
    pincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be exactly 6 digits." }),
})

export type AddressFormValues = z.infer<typeof orderAddressSchema>