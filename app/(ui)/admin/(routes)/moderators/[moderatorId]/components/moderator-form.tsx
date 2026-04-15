"use client"

import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react"
import { Admin } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/Heading"
import { Separator } from "@/components/ui/separator"
import AlertModal from "@/components/modals/alert-modal";
import { http } from "@/lib/http";


const ModeratorFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
});

type ModeratorFormValues = z.infer<typeof ModeratorFormSchema>

interface ModeratorFormProps {
    initialData: Admin | null;
}

export const ModeratorForm = ({ initialData }: ModeratorFormProps) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Moderator" : "Create Moderator";
    const description = initialData ? "Edit moderator account details" : "Add a new moderator account";
    const action = initialData ? "Save Changes" : "Create Moderator";

    const form = useForm<ModeratorFormValues>({
        resolver: zodResolver(ModeratorFormSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            email: initialData.email,
            password: "",
        } : {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: ModeratorFormValues) => {
        try {
            setLoading(true);
            const payload = { ...values };

            if (!initialData && !payload.password) {
                toast.error("Password is required for new moderators");
                return;
            }

            if (initialData && !payload.password) delete payload.password;

            if (initialData) {
                await http.patch(`/api/admin/moderators/${params.moderatorId}`, payload);
            } else {
                await http.post(`/api/admin/moderators`, payload);
            }

            toast.success(initialData ? "Moderator updated" : "Moderator created");
            router.push('/admin/moderators');
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await http.delete(`/api/admin/moderators/${params.moderatorId}`);
            router.push('/admin/moderators');
            router.refresh();
            toast.success("Moderator deleted.");
        } catch (error) {
            toast.error("Ensure all linked calibrations are removed before deleting.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex justify-between items-center">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Name */}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl><Input placeholder="Full name" disabled={loading} {...field} /></FormControl>
                                <FormDescription>
                                    {'Moderator Name'}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Email */}
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl><Input type="email" placeholder="email@example.com" disabled={loading} {...field} /></FormControl>
                                <FormDescription>
                                    {'Moderator Email Address'}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Password */}
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl><Input type="password" placeholder="••••••" disabled={loading} {...field} /></FormControl>
                                <FormDescription>
                                    {initialData ? "Leave blank to keep current password" : "Minimum 6 characters"}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <Button disabled={loading} type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}