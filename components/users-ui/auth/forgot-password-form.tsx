"use client"

import * as z from "zod"
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavbarLogo } from "@/components/ui/resizable-navbar"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp"
import { http } from "@/lib/http"


interface ForgotPasswordFormProps {
    role: 'user' | 'vendor' | 'monitor',
    otpRoute: string,
    emailVerifyRoute: string,
    passwordResetRoute: string,
    redirectRoute: string,
}

const forgotPasswordSchema = z.object({
    email: z.email().min(1, "Email is required"),
    password: z.string().or(z.literal("")),
    confirmPassword: z.string().or(z.literal("")),
}).superRefine((data, ctx) => {
    if (data.password && data.password.length > 0) {
        if (data.password.length < 6) {
            ctx.addIssue({
                code: "custom",
                message: "Password must be at least 6 characters",
                path: ["password"],
            });
        }
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirmPassword"],
            });
        }
    }
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordForm = ({ role, otpRoute, emailVerifyRoute, passwordResetRoute, redirectRoute }: ForgotPasswordFormProps) => {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [verifiedOtp, setVerifiedOtp] = useState("");

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    // Step 1: Sending OTP to the email
    async function onEmailSubmit(values: ForgotPasswordValues) {
        const toastId = toast.loading('Processing request...');
        try {
            toast.loading('Sending verification code...', { id: toastId });
            const res = await http.post(emailVerifyRoute, { email: values.email });

            if (res.data.error || res.status !== 200) {
                throw new Error(res.data.message || 'Something went wrong.');
            }

            toast.success('Reset code sent to email!', { id: toastId });
            setStep('otp');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error sending reset email.';
            toast.error(errorMessage, { id: toastId });
        }
    }

    // Step 2: Verifying OTP
    async function onOtpComplete(otp: string) {
        setIsVerifying(true);
        const toastId = toast.loading('Verifying OTP...');
        try {
            const email = form.getValues("email");
            const res = await http.post(otpRoute, { otp, email });

            if (res.data.error) {
                throw new Error(res.data.message || 'Verification failed');
            }

            toast.success("OTP verified successfully!", { id: toastId });
            setVerifiedOtp(otp);
            setStep('password');
        } catch (error: any) {
            console.error("OTP Verification Error:", error);
            const errorMessage = error.response?.data?.message || error.message || 'Invalid OTP';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsVerifying(false);
        }
    }

    // Step 3: Submitting New Password
    async function onPasswordSubmit(values: ForgotPasswordValues) {
        setIsSubmittingPassword(true);
        const toastId = toast.loading('Updating password...');
        try {
            const res = await http.post(passwordResetRoute, {
                email: values.email,
                otp: verifiedOtp,
                password: values.password
            });

            if (res.data.error) {
                throw new Error(res.data.message || 'Failed to update password');
            }

            toast.success("Password reset successfully!", { id: toastId });
            router.push(redirectRoute);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error resetting password.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsSubmittingPassword(false);
        }
    }

    // Resend OTP helper
    async function handleResendOtp() {
        const email = form.getValues("email");
        if (!email) return;

        const toastId = toast.loading('Resending code...');
        try {
            await http.post(emailVerifyRoute, { email });
            toast.success('A new code has been sent!', { id: toastId });
        } catch (error) {
            toast.error('Failed to resend code.', { id: toastId });
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <Card className="w-full max-w-md shadow-lg border-none bg-white relative overflow-hidden">
                <CardHeader className="space-y-1 pb-8 text-center">
                    <div className="flex justify-center mb-2">
                        <NavbarLogo />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Verify Your Email' : 'Create New Password'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {step === 'email'
                            ? 'Enter your email address and we will send you a code to reset your password.'
                            : step === 'otp'
                                ? `We've sent a 6-digit code to ${form.getValues("email")}`
                                : 'Please enter and confirm your secure new password.'}
                    </p>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        {step === 'email' ? (
                            <motion.div
                                key="email-step"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Registered Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="email@business.com" {...field} className="bg-slate-50 py-6" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 shadow-md transition-all active:scale-95"
                                        >
                                            Send Reset Code
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        ) : step === 'otp' ? (
                            <motion.div
                                key="otp-step"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center justify-center py-4 space-y-8"
                            >
                                <div className="space-y-4 text-center">
                                    <h3 className="text-sm font-medium text-slate-600">Enter 6-digit OTP</h3>
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

                                <div className="flex flex-col items-center space-y-4 w-full">
                                    <Button
                                        disabled={isVerifying}
                                        onClick={() => setStep('email')}
                                        variant="ghost"
                                        className="text-slate-500 hover:text-blue-600 w-full"
                                    >
                                        Back to Email Entry
                                    </Button>
                                    <p className="text-sm text-slate-500">
                                        Didn't receive the code?{' '}
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            className="text-blue-600 font-semibold hover:underline"
                                        >
                                            Resend OTP
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="password-step"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">New Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="••••••••" {...field} className="bg-slate-50 py-6" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold">Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="••••••••" {...field} className="bg-slate-50 py-6" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isSubmittingPassword}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 shadow-md transition-all active:scale-95"
                                        >
                                            Update Password
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPasswordForm