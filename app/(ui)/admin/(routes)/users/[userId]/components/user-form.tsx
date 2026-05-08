"use client"

import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { User, AccountType, Status } from "@prisma/client"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { http } from "@/lib/http";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/Heading"
import { Separator } from "@/components/ui/separator"
import AlertModal from "@/components/modals/alert-modal";
import { UserFormSchema } from "@/lib/validation/admin/User";
import { cn } from "@/lib/utils";
import { ArrowLeft, Trash } from "lucide-react";


type UserFormValues = z.infer<typeof UserFormSchema>

export const UserForm = ({ initialData }: { initialData: Partial<User> | null }) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm < UserFormValues > ({
        resolver: zodResolver(UserFormSchema),
        defaultValues: initialData ? {
            ...initialData,
            password: "",
            organizationName: initialData.organizationName || "",
            gstNumber: initialData.gstNumber || "",
        } : {
            name: "",
            email: "",
            password: "",
            accountType: AccountType.PERSONAL,
            status: Status.APPROVED,
            organizationName: "",
            gstNumber: "",
        },
    });

    const accountType = form.watch("accountType");

    const onSubmit = async (values: UserFormValues) => {
        try {
            setLoading(true);
            const endpoint = initialData ? `/api/admin/user/${params.userId}` : `/api/admin/user`;
            const method = initialData ? 'patch' : 'post';

            await http[method](endpoint, values);

            toast.success(initialData ? "User updated" : "User created");
            router.back();
            router.refresh();
        } catch (error: any) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={() => { }} loading={loading} />
            <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="group"
            >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:scale-125" />
                Back
            </Button>
            <div className="flex justify-between items-center">
                <Heading
                    title={initialData ? "Edit User" : "Create User"}
                    description="Manage user details"
                />
                <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input disabled={loading} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input disabled={loading} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className={cn(
                                                    "w-full font-medium",
                                                    field.value === Status.APPROVED && "text-green-500",
                                                    field.value === Status.PENDING && "text-yellow-500",
                                                    field.value === Status.REJECTED && "text-red-400",
                                                    field.value === Status.BANNED && "text-red-600",
                                                )}
                                            >
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem
                                                value={Status.APPROVED}
                                                className="text-green-500 focus:text-green-500 focus:bg-green-50"
                                            >
                                                Approved
                                            </SelectItem>

                                            <SelectItem
                                                value={Status.PENDING}
                                                className="text-yellow-500 focus:text-yellow-500 focus:bg-yellow-50"
                                            >
                                                Pending
                                            </SelectItem>

                                            <SelectItem
                                                value={Status.REJECTED}
                                                className="text-red-400 focus:text-red-400 focus:bg-red-50"
                                            >
                                                Rejected
                                            </SelectItem>

                                            <SelectItem
                                                value={Status.BANNED}
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                            >
                                                Banned
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <FormDescription className="text-red-500">
                                        Data from only <span className="mx-1 font-bold">approved</span> devices can be accepted.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="accountType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Type</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {Object.values(AccountType).map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* CONDITIONAL FIELDS */}
                        {accountType === AccountType.ORGANIZATION && (
                            <>
                                <FormField control={form.control} name="organizationName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organization Name</FormLabel>
                                        <FormControl><Input placeholder="Company Ltd" disabled={loading} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="gstNumber" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GST Number</FormLabel>
                                        <FormControl><Input placeholder="22AAAAA0000A1Z5" disabled={loading} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </>
                        )}

                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl><Input type="password" disabled={loading} {...field} /></FormControl>
                                <FormDescription>
                                    {initialData ? "Leave blank to keep current password" : "Minimum 6 characters"}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} type="submit">{initialData ? "Save" : "Create"}</Button>
                </form>
            </Form>
        </>
    )
}