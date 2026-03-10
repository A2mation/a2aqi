"use client"

import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RawCouponColumn } from "../../components/columns";


const formSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters").transform(val => val.toUpperCase()),
    description: z.string().min(1, "Description is required"),
    discountType: z.enum(["FIXED", "PERCENTAGE"]),
    discountValue: z.coerce.number().min(1, "Value must be at least 1"),
    usage: z.preprocess((val) => val === "" ? undefined : val, z.coerce.number().optional()),
    validUntil: z.string().min(1, "Expiry date is required"),
    isActive: z.boolean().default(true),
});

type CouponFormValues = z.infer<typeof formSchema>;

interface CouponPops {
    initialData: RawCouponColumn | null;
}

export const CouponForm = ({ initialData }: CouponPops) => {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const title = initialData ? "Edit Coupon" : "Create Coupon";
    const description = initialData ? "Update promotion details" : "Add a new discount code";
    const action = initialData ? "Save Changes" : "Create";

    const form = useForm<CouponFormValues>({
        resolver: zodResolver(formSchema) as any, // Removed 'as any'
        defaultValues: initialData ? {
            code: initialData.code || "",
            description: initialData.description || "",
            discountType: initialData.discountType || undefined,
            discountValue: Number(initialData.discountValue),
            isActive: initialData.isActive || false,
            usage: initialData.usage ? Number(initialData.usage) : undefined,
            validUntil: new Date(initialData.validUntil).toISOString().slice(0, 16),
        } : {
            code: "",
            description: "",
            discountType: "FIXED",
            discountValue: 0,
            usage: undefined,
            validUntil: "",
            isActive: true,
        },
    });

    const { mutate: saveCoupon, isPending: isSaving } = useMutation({
        mutationFn: async (values: CouponFormValues) => {
            if (initialData) {
                return await http.patch(`/api/admin/coupons/${params.couponId}`, values);
            }
            return await http.post(`/api/admin/coupons`, values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            toast.success(initialData ? "Coupon updated" : "Coupon created");
            router.push('/admin/coupons');
            router.refresh();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    });

    const { mutate: deleteCoupon, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            await http.delete(`/api/admin/coupons/${params.couponId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            toast.success("Coupon deleted");
            router.push(`/admin/coupons`);
            router.refresh();
        },
        onSettled: () => setOpen(false)
    });

    const loading = isSaving || isDeleting;

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => deleteCoupon()}
                loading={isDeleting}
            />
            <div className="flex justify-between items-center">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator className="my-4" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => saveCoupon(data))} className="space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coupon Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="E.g. SUMMER50"
                                            disabled={loading}
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="discountType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Type</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="FIXED">Fixed Amount</SelectItem>
                                            <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="discountValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Value</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="10" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="validUntil"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>{`Add Expriry Date & Time`}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="usage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Redemptions</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Unlimited"
                                            disabled={loading}
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormDescription>Total uses allowed.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description / Internal Note</FormLabel>
                                    <FormControl>
                                        <Input placeholder="What is this coupon for?" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>Add a small Note</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Active Status</FormLabel>
                                    <FormDescription>Enable or disable instantly.</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={loading}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading}>
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}