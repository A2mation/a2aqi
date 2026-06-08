import * as z from 'zod'
import { ArrowRight, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const addressSchema = z.object({
    fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
    phone: z.string().regex(/^[6-9]\d{9}$/, { message: "Please enter a valid 10-digit Indian phone number." }),
    addressLine: z.string().min(5, { message: "Please enter your detailed shipping address." }),
    city: z.string().min(2, { message: "City name is required." }),
    state: z.string().min(2, { message: "State name is required." }),
    pincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be exactly 6 digits." }),
})

export type AddressFormValues = z.infer<typeof addressSchema>

const AddressForm = ({
    setStep,
    setSavedAddress
}: {
    setStep: (v: number) => void,
    setSavedAddress: (add: AddressFormValues | null) => void
}) => {
   
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            addressLine: "",
            city: "",
            state: "",
            pincode: "",
        },
    })

    const onAddressSubmit = (data: AddressFormValues) => {
        setSavedAddress(data)
        setStep(2)
    }
    return (
        <>
            <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <Card className="border-slate-200/80 shadow-md bg-white rounded-xl">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center space-x-2 text-slate-800">
                            <MapPin className="w-5 h-5 text-emerald-500" />
                            <CardTitle className="text-xl font-bold">Delivery Address</CardTitle>
                        </div>
                        <CardDescription>Enter your terminal dispatch location parameters.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onAddressSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">Recipient Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} className="focus-visible:ring-emerald-500" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">Contact Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="9876543210" {...field} className="focus-visible:ring-emerald-500" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="addressLine"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-medium">Street Address / Unit Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Plot 42, Sector V, Salt Lake" {...field} className="focus-visible:ring-emerald-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">City</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Kolkata" {...field} className="focus-visible:ring-emerald-500" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">State</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="West Bengal" {...field} className="focus-visible:ring-emerald-500" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pincode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">Pincode</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="700091" {...field} className="focus-visible:ring-emerald-500" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-5 rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all">
                                    <span>Continue to Payment</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    )
}

export default AddressForm
