"use client"

import * as z from "zod"
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import imageCompression from 'browser-image-compression';

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavbarLogo } from "@/components/ui/resizable-navbar"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp"
import { vendorFormSchema } from '@/lib/validation/vendor/Vendor.registration.schema'
import { convertToBase64 } from "@/utils/converters"
import { http } from "@/lib/http"


const VendorRegistrationPage = () => {
    const [step, setStep] = useState < 'details' | 'otp' > ('details');
    const [isVerifying, setIsVerifying] = useState(false);

    const form = useForm < z.infer < typeof vendorFormSchema >> ({
        resolver: zodResolver(vendorFormSchema),
        defaultValues: {
            vendorName: "",
            mobileNumber: "",
            email: "",
            address: "",
            gstNumber: "",
            agreeTerms: false,
        },
    })

    async function onRegisterInitiate(values: z.infer<typeof vendorFormSchema>) {
        const toastId = toast.loading('Processing registration...');
        try {
            const imageFile = values.gstCertificate[0];

            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };


            const compressedFile = await imageCompression(imageFile, options);

            const base64String = await convertToBase64(compressedFile);

            const finalPayload = {
                ...values,
                gstCertificate: base64String,
            };

            // console.log("Details captured with Base64:", finalPayload);
            toast.loading('Sending details...', { id: toastId });
            const res = await http.post('/api/vendor/auth/register', finalPayload);
            if (res.data.error) {
                throw new Error(res.data.message || 'Something Went Wrong.');
            }

            toast.success('Verification mail sent!', { id: toastId });
            setStep('otp');

        } catch (error) {
            // console.error("Compression/Conversion error:", error);
            const errorMessage = error instanceof Error ? error.message : 'Error occurred in file upload.';
            toast.error(errorMessage, { id: toastId });
        }
    }

    // Handle final OTP verification
    function onOtpComplete(otp: string) {
        setIsVerifying(true);
        console.log("Verifying OTP:", otp);
        // Simulate API call
        setTimeout(() => {
            setIsVerifying(false);
            toast.success("Registration successfully completed!");
        }, 2000);
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <Card className="w-full max-w-4xl shadow-lg border-none bg-white relative overflow-hidden">
                <CardHeader className="space-y-1 pb-8">
                    <NavbarLogo />
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {step === 'details' ? 'Vendor Registration' : 'Verify Mobile Number'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {step === 'details'
                            ? 'Enter your business details to partner with us.'
                            : `We've sent a code to ${form.getValues("email")}`}
                    </p>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        {step === 'details' ? (
                            <motion.div
                                key="details-step"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onRegisterInitiate)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="vendorName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-semibold">Vendor Name</FormLabel>
                                                        <FormControl><Input placeholder="Enter business name" {...field} className="bg-slate-50" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="mobileNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-semibold">Vendor Mobile Number</FormLabel>
                                                        <FormControl><Input placeholder="10-digit number" {...field} className="bg-slate-50" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-semibold">Vendor Email ID</FormLabel>
                                                        <FormControl><Input placeholder="email@business.com" {...field} className="bg-slate-50" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-semibold">Vendor Address</FormLabel>
                                                        <FormControl><Input placeholder="Full office address" {...field} className="bg-slate-50" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="gstNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-semibold">GST Number</FormLabel>
                                                        <FormControl><Input placeholder="15-digit GSTIN" {...field} className="bg-slate-50" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="gstCertificate"
                                                render={({ field: { onChange, value, ...rest } }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-semibold">GST Certificate (Image Only)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                className="bg-slate-50 cursor-pointer file:text-blue-600 file:font-medium"
                                                                onChange={(e) => onChange(e.target.files)}
                                                                {...rest}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="agreeTerms"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-sm font-medium text-slate-600">Agree with Terms of Use and Privacy Policy</FormLabel>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="w-full md:w-32 bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 shadow-md transition-all active:scale-95">
                                            Register
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp-step"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center justify-center py-10 space-y-8"
                            >
                                <div className="space-y-4 text-center">
                                    <h3 className="text-lg font-medium">Enter 6-digit OTP</h3>
                                    <InputOTP
                                        maxLength={6}
                                        onComplete={onOtpComplete}
                                        disabled={isVerifying}
                                        autoFocus
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className="w-12 h-14 text-lg border-slate-300" />
                                            <InputOTPSlot index={1} className="w-12 h-14 text-lg border-slate-300" />
                                            <InputOTPSlot index={2} className="w-12 h-14 text-lg border-slate-300" />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} className="w-12 h-14 text-lg border-slate-300" />
                                            <InputOTPSlot index={4} className="w-12 h-14 text-lg border-slate-300" />
                                            <InputOTPSlot index={5} className="w-12 h-14 text-lg border-slate-300" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                <div className="flex flex-col items-center space-y-4">
                                    <Button
                                        disabled={isVerifying}
                                        onClick={() => setStep('details')}
                                        variant="ghost"
                                        className="text-slate-500 hover:text-blue-600"
                                    >
                                        Back to Registration
                                    </Button>
                                    <p className="text-sm text-slate-500">
                                        Didn't receive the code? <button className="text-blue-600 font-semibold hover:underline">Resend OTP</button>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}

export default VendorRegistrationPage