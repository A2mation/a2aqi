'use client'

import * as z from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User as PrismaUser, Address } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { profileSchema } from "@/lib/validation/UserProfileSchema"
import { http } from "@/lib/http"
import { cn } from "@/lib/utils"


export interface UserWithAddresses extends PrismaUser {
    addresses: Address[];
    billingAddress?: Address | null;
}

interface Props {
    user: UserWithAddresses;
}

type ProfileFormValues = z.infer<typeof profileSchema>

export const UserDetailsForm = ({
    user
}: Props) => {
    const queryClient = useQueryClient();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            recoveryEmail: "",
            phoneNumber: "",
            accountType: "PERSONAL",
            organizationName: "",
            gstNumber: "",
            billingAddressId: "",
        },
    })
    console.log(user)

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || "",
                recoveryEmail: user.recoveryEmail || "",
                phoneNumber: user.phoneNumber || "",
                accountType: user.accountType || "PERSONAL",
                organizationName: user.organizationName || "",
                gstNumber: user.gstNumber || "",
                billingAddressId: user.billingAddressId || "",
            })
        }
    }, [user, form])



    const updateMutation = useMutation({
        mutationFn: async (values: ProfileFormValues) => {
            const { data } = await http.patch("/api/user", values)
            return data
        },
        onSuccess: () => {
            toast.success("Profile updated successfully")
            queryClient.invalidateQueries({ queryKey: ["user-profile"] })
        },
        onError: () => {
            toast.error("Failed to update profile")
        },
    })
    console.log("Current Form Value:", form.watch("billingAddressId"))
    return (
        <>
            <Avatar className="w-20 h-20 border shadow-xl">
                <AvatarFallback>
                    {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
            </Avatar>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((values) =>
                        updateMutation.mutate(values)
                    )}
                    className="space-y-6"
                >
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email (readonly) */}
                    <div className="space-y-2">
                        <FormLabel>Email</FormLabel>
                        <Input value={user?.email} disabled />
                    </div>

                    {/* Recovery Email */}
                    <FormField
                        control={form.control}
                        name="recoveryEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Recovery Email</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone */}
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* 1. The Business Nudge Banner */}
                    {form.watch("accountType") === "PERSONAL" && (
                        <div className="flex items-center gap-3 p-4 rounded-lg border border-indigo-100 bg-indigo-50/50 text-indigo-900 shadow-sm animate-in fade-in zoom-in duration-300">
                            <div className="bg-indigo-100 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                                    <rect width="16" height="16" x="4" y="4" rx="2" /><path d="M9 22V12h6v10" /><path d="M8 4V2h8v2" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">Business Profile</span>
                                <span className="text-xs text-indigo-600/80">Click <strong>Organization</strong> in Account Type to enter GST and company details for tax invoices.</span>
                            </div>
                        </div>
                    )}

                    {/* 2. Account Type Selection */}
                    <FormField
                        control={form.control}
                        name="accountType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Type</FormLabel>
                                <Select key={field.value} defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="PERSONAL">Personal Account</SelectItem>
                                        <SelectItem value="ORGANIZATION">Organization / Business</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* 3. Grouped Organization Fields */}
                    {form.watch("accountType") === "ORGANIZATION" && (
                        <div className="space-y-5 p-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 animate-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Company Information</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            <FormField
                                control={form.control}
                                name="organizationName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organization Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Acme Inc." className="bg-white" {...field} />
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
                                                placeholder="e.g. 22AAAAA0000A1Z5"
                                                className="bg-white font-mono uppercase"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                            />
                                        </FormControl>
                                        <p className="text-[10px] text-gray-400 mt-1 italic">Format: 15-digit Alphanumeric (State Code + PAN + Checksum)</p>
                                        <p className="text-[10px] text-red-400 mt-1 italic">**This GSTIN and Organization name will be used for GST-compliant invoicing and tax filings. **</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="billingAddressId"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between ">
                                    <FormLabel>Primary Billing Address</FormLabel>

                                    {(!user?.addresses || user.addresses.length === 0) && (
                                        <Button
                                            type="button"
                                            onClick={() => document.getElementById("address-section")?.scrollIntoView({ behavior: 'smooth' })}
                                            className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded hover:bg-orange-100 transition-colors animate-pulse"
                                        >
                                            ⚠️ PLEASE ADD AN ADDRESS BELOW
                                        </Button>
                                    )}
                                </div>

                                <Select
                                    key={field.value}
                                    value={field.value}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!user?.addresses || user.addresses.length === 0}
                                >
                                    <FormControl>
                                        <SelectTrigger className={cn(!user?.addresses?.length && "border-red-500 bg-orange-50/30 ")}>
                                            <SelectValue
                                                placeholder={
                                                    (!user?.billingAddressId || user.addresses.length === 0)
                                                        ? "No addresses found - Create one first"
                                                        : "Select a saved address for billing"
                                                }
                                            />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent className="w-70">
                                        <SelectGroup>
                                            <SelectLabel>
                                                Billing Address
                                            </SelectLabel>
                                            {user?.addresses && user.addresses.length > 0 ? (
                                                user.addresses.map((addr: any) => (
                                                    <SelectItem key={addr.id} value={addr.id}>
                                                        {addr.street}, {addr.city} ({addr.zipCode})
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                /* This is a "Dummy" item to prevent Radix UI from crashing, but the trigger is disabled anyway */
                                                <SelectItem value="none" disabled>No addresses found</SelectItem>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                    >
                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </>
    )
}

