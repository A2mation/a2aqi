"use client"

import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { http } from "@/lib/http";
import { Input } from "@/components/ui/input"
import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { userRegisterFormSchema } from "@/lib/validation/vendor/Vendor.user.register.schema";


type VendorUserFormValues = z.infer<typeof userRegisterFormSchema>;

export const VendorUserForm = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm < VendorUserFormValues > ({
        resolver: zodResolver(userRegisterFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phoneNumber: "",
        },
    });

    const { mutate: registerUser, isPending: isLoading } = useMutation({
        mutationFn: async (values: VendorUserFormValues) => {
            return await http.post(`/api/vendor/register-user`, values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-users"] });
            toast.success("User registered successfully!");
            router.push('/vendor/users');
            router.refresh();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Registration failed");
        }
    });

    const onSubmit = (data: VendorUserFormValues) => {
        registerUser(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 px-3"
        >
            <div className="flex items-center justify-between">
                <Heading
                    title="Register New User"
                    description="Create a new user account under your vendor profile"
                    Icon={User}
                />
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="user@example.com" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1234567890" disabled={isLoading} {...field} />
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
                                    <FormLabel>Initial Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="******"
                                                disabled={isLoading}
                                                {...field}
                                                className="pr-10 transition-all duration-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isLoading}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                            >
                                                {/* AnimatePresence handles the exit/entry animation of the icons */}
                                                <AnimatePresence mode="wait" initial={false}>
                                                    <motion.div
                                                        key={showPassword ? "eye-open" : "eye-closed"}
                                                        initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                        exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                                                        transition={{ duration: 0.15 }}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        The user can change this after their first login.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button disabled={isLoading} className="ml-auto cursor-pointer" type="submit">
                        Register User
                    </Button>
                </form>
            </Form>
        </motion.div>
    );
}