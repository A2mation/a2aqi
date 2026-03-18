"use client";

import * as z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, addMonths } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeviceSubscriptionStatus, SubscriptionDuration } from "@prisma/client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DeviceSubscriptionSchema } from "@/lib/validation/AdminDeviceSubscription";
import { useMutation } from "@tanstack/react-query";
import { http } from "@/lib/http";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


type FormValues = z.infer<typeof DeviceSubscriptionSchema>;

interface DeviceSubscriptionPops {
    initialData: {
        id: string;
        serialNo: string;
        email: string;
        paidAmount: number | undefined;
        planType: SubscriptionDuration | undefined;
        status: DeviceSubscriptionStatus | undefined;
        startDate: Date | undefined;
        endDate: Date | undefined;
        autoRenew: boolean | undefined;
        adminModified: boolean | undefined;
        notes: string | null | undefined;
        pricingPlans: {
            duration: SubscriptionDuration;
            id: string;
            price: number;
        }[]
    } | null;
}

export const DeviceSubscription = ({
    initialData
}: DeviceSubscriptionPops) => {
    const router = useRouter();

    const title = "Device Subscription";
    const description = "Manage and activate manual subscriptions for users.";
    const action = initialData ? 'Update Device Subscription' : 'Create Device Subscription';

    const form = useForm<FormValues>({
        resolver: zodResolver(DeviceSubscriptionSchema) as any,
        defaultValues: {
            serialNo: initialData?.serialNo ?? '',
            email: initialData?.email ?? '',
            paidAmount: initialData?.paidAmount ?? 0,
            planType: initialData?.planType ?? SubscriptionDuration.SIX_MONTHS,
            status: initialData?.status ?? DeviceSubscriptionStatus.ACTIVE,
            startDate: initialData?.startDate ?? new Date(),
            endDate: initialData?.endDate ?? addMonths(new Date(), 6),
            autoRenew: initialData?.autoRenew ?? false,
            adminModified: initialData?.adminModified ?? true,
            notes: initialData?.notes ?? "",
        },
    });

    const watchedPlan = form.watch("planType");
    const watchedStartDate = form.watch("startDate");

    const availableDurations = initialData?.pricingPlans.map(p => p.duration) || [];

    useEffect(() => {
        if (watchedStartDate && watchedPlan) {
            // Update Date
            let monthsToAdd = 12;
            if (watchedPlan === SubscriptionDuration.THREE_MONTHS) monthsToAdd = 3;
            if (watchedPlan === SubscriptionDuration.SIX_MONTHS) monthsToAdd = 6;

            const planDetails = initialData?.pricingPlans.find(p => p.duration === watchedPlan);
            form.setValue("endDate", addMonths(watchedStartDate, monthsToAdd));

            // Update Price (Find price in pricingPlans array)
            if (planDetails) {
                form.setValue("paidAmount", planDetails.price);
            }
        }
    }, [watchedPlan, watchedStartDate, form, initialData?.pricingPlans]);


    const { mutate: updateSubscription, isPending } = useMutation({
        mutationFn: async (values: FormValues) => {
            console.log(values)
            const response = await http.post(
                `/api/admin/device/${initialData?.id}/subscription`,
                values
            );

            if (response.status !== 200) {
                throw new Error(response.data?.message || "Failed to update");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Subscription updated successfully");
            router.refresh();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || "Something went wrong";
            toast.error(message);
        }
    });

    const onSubmit = (values: FormValues) => {
        updateSubscription(values);
    };

    return (
        <>
            <div className="flex justify-between items-center pt-8">
                <Heading title={title} description={description} />
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="serialNo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Serial No.</FormLabel>
                                <FormControl><Input disabled placeholder="65f1..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Email</FormLabel>
                                <FormControl><Input disabled placeholder="65f2..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="planType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Plan Duration</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select Plan" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem
                                            value={SubscriptionDuration.THREE_MONTHS}
                                            disabled={!availableDurations.includes(SubscriptionDuration.THREE_MONTHS)}
                                        >
                                            3 Months {!availableDurations.includes(SubscriptionDuration.THREE_MONTHS) && "(Unavailable)"}
                                        </SelectItem>

                                        <SelectItem
                                            value={SubscriptionDuration.SIX_MONTHS}
                                            disabled={!availableDurations.includes(SubscriptionDuration.SIX_MONTHS)}
                                        >
                                            6 Months {!availableDurations.includes(SubscriptionDuration.SIX_MONTHS) && "(Unavailable)"}
                                        </SelectItem>

                                        <SelectItem
                                            value={SubscriptionDuration.TWELVE_MONTHS}
                                            disabled={!availableDurations.includes(SubscriptionDuration.TWELVE_MONTHS)}
                                        >
                                            12 Months {!availableDurations.includes(SubscriptionDuration.TWELVE_MONTHS) && "(Unavailable)"}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Only plans defined in the Pricing module are enabled.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="paidAmount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paid Amount (₹)</FormLabel>
                                <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />


                        <FormField control={form.control} name="startDate" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="endDate" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Date (Auto-calculated)</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button disabled variant={"outline"} className={cn("pl-3 text-left font-normal bg-muted/50")}>
                                                {field.value ? format(field.value, "PPP") : <span>Calculated date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>This date adjusts based on the selected plan.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-slate-50">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto Renew</FormLabel>
                            <FormDescription>Enable automatic billing for next cycle.</FormDescription>
                        </div>
                        <FormField control={form.control} name="autoRenew" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Admin Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Reason for manual override..." className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="flex justify-end pb-4 border-b">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full md:w-50"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                action
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};