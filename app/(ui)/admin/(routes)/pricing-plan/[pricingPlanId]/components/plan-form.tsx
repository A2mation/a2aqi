"use client"

import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react"
import { DeviceModel, PricingPlan, SubscriptionDuration } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/Heading"
import { Separator } from "@/components/ui/separator"
import AlertModal from "@/components/modals/alert-modal";
import { http } from "@/lib/http";

// 1. Updated Schema
const formSchema = z.object({
    modelId: z.string().min(1, "Device Model is required"),
    duration: z.nativeEnum(SubscriptionDuration),
    price: z.coerce.number().min(1, "Price must be at least 1"),
    currency: z.string().default("INR"),
    isEnabled: z.boolean().default(true),
});

type PricingPlanFormValues = z.infer<typeof formSchema>

interface PricingPlanProps {
    initialData: PricingPlan | null;
    deviceModels: DeviceModel[]; // Pass these in from the Page
}

export const PricingPlanForm = ({ initialData, deviceModels }: PricingPlanProps) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Pricing Plan" : "Create Pricing Plan";
    const description = initialData ? "Modify plan details" : "Add a new subscription duration and price";
    const toastMsg = initialData ? "Plan updated." : "Plan created.";
    const action = initialData ? "Save Changes" : "Create Plan";

    const form = useForm<PricingPlanFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            modelId: initialData?.modelId  ?? "",
            duration: initialData?.duration ?? SubscriptionDuration.THREE_MONTHS,
            price: initialData?.price ?? 0,
            currency:  initialData?.currency ?? "INR",
            isEnabled: initialData?.isEnabled ?? true,
        },
    });

    const onSubmit = async (data: PricingPlanFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await http.patch(`/api/admin/pricing-plan/${params.pricingPlanId}`, data);
            } else {
                await http.post(`/api/admin/pricing-plan`, data);
            }
            router.refresh();
            router.push('/admin/pricing-plan');
            toast.success(toastMsg);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Check your unique constraint (One price per duration per model)");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await http.delete(`/api/admin/pricing-plan/${params.pricingPlanId}`);
            router.refresh();
            router.push(`/admin/pricing-plan`);
            toast.success("Plan deleted successfully");
        } catch (error) {
            toast.error("Make sure you removed all active subscriptions using this plan first.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
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
                        {/* Device Model Select */}
                        <FormField
                            control={form.control}
                            name="modelId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Device Model</FormLabel>
                                    <Select disabled={loading || !!initialData} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a model" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {deviceModels.map((model) => (
                                                <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Duration Select */}
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration</FormLabel>
                                    <Select disabled={loading || !!initialData} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="THREE_MONTHS">3 Months</SelectItem>
                                            <SelectItem value="SIX_MONTHS">6 Months</SelectItem>
                                            <SelectItem value="TWELVE_MONTHS">12 Months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price Input */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price (INR)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="2999" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status Select */}
                        <FormField
                            control={form.control}
                            name="isEnabled"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan Status</FormLabel>
                                    <Select disabled={loading} onValueChange={(v) => field.onChange(v === "true")} value={field.value ? "true" : "false"}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="true">Active</SelectItem>
                                            <SelectItem value="false">Hidden / Disabled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
                </form>
            </Form>
        </>
    )
}