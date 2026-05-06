"use client"

import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus, Building2, Landmark, User } from "lucide-react";
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
} from "@/components/ui/form"
import { cn } from "@/lib/utils";
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
            accountType: "PERSONAL",
            organizationName: "",
            gstNumber: "",
        },
    });

    const accountType = form.watch("accountType");
    const isOrg = accountType === "ORGANIZATION";

    const { mutate: registerUser, isPending: isLoading } = useMutation({
        mutationFn: async (values: VendorUserFormValues) => {
            return await http.post(`/api/vendor/users`, values);
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
        const payload = {
            ...data,
            organizationName: isOrg ? data.organizationName : undefined,
            gstNumber: isOrg ? data.gstNumber : undefined,
        };
        registerUser(payload);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 px-3"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Heading
                    title="Register New User"
                    description="Create a new user account under your vendor profile"
                    Icon={UserPlus}
                />

                <div
                    className={cn(
                        "flex items-center gap-3 p-1 rounded-xl border cursor-pointer transition-all duration-300 w-fit",
                        isOrg ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-gray-50 border-gray-200"
                    )}
                >
                    <button
                        type="button"
                        onClick={() => form.setValue("accountType", "PERSONAL")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                            !isOrg ? "bg-white shadow-sm text-gray-900 border border-gray-100" : "text-gray-500"
                        )}
                    >
                        <User className="h-4 w-4" />
                        Individual
                    </button>
                    <button
                        type="button"
                        onClick={() => form.setValue("accountType", "ORGANIZATION")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                            isOrg ? "bg-primary text-white shadow-md" : "text-gray-500"
                        )}
                    >
                        <Building2 className="h-4 w-4" />
                        Organization
                    </button>
                </div>
            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                                        <Input placeholder="9876543210" disabled={isLoading} {...field} />
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
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Organization Section controlled */}
                        <AnimatePresence mode="wait">
                            {isOrg && (
                                <motion.div
                                    className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="col-span-1 md:col-span-2">
                                        <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                                            <Landmark className="h-4 w-4" /> Business Details
                                        </div>
                                        <Separator className="mb-4 bg-primary/10" />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="organizationName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Organization Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter company name" disabled={isLoading} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="gstNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>GST Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="27AAACA1234A1Z5"
                                                        disabled={isLoading}
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                        className="uppercase"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button disabled={isLoading} className="min-w-37.5 shadow-lg shadow-primary/20" type="submit">
                            {isLoading ? "Creating..." : "Register User"}
                        </Button>
                    </div>
                </form>
            </Form>
        </motion.div>
    );
}