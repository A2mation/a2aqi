'use client'

import { useState } from 'react'
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NavbarLogo } from "@/components/ui/resizable-navbar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { signInSchema, SignInValues } from './schema';

const AdminLoginCard = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: "", password: "" },
    })

    async function onSubmit(value: SignInValues) {
        // console.log(value)

        const toastId = toast.loading(
            "Signing in..."
        );
        try {
            setLoading(true);

            const res = await signIn("admin", {
                ...value,
                redirect: false
            })

            if (res?.error) {
                toast.error(res.error, { id: toastId });
                return;
            }

            toast.success(`Welcome back Admin 👋`, { id: toastId });
            form.reset();
            router.push("/admin");
        } catch (error: any) {
            const message =
                error?.response?.data?.message || "Something went wrong";
            toast.error(message, { id: toastId });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className='text-red-500'>Admin Login</CardTitle>
                <CardDescription>Login For a2aqi.com Admins</CardDescription>
                <CardAction>
                    <NavbarLogo />
                </CardAction>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            Sign In
                        </Button>
                    </form>
                </Form>
            </CardContent>

            <CardFooter className="flex-col gap-2">
                <div className="flex items-center justify-center w-full">
                    {`Login to Access Admin control's of a2aqi.com`}
                </div>
            </CardFooter>
        </Card>
    )
}

export default AdminLoginCard
