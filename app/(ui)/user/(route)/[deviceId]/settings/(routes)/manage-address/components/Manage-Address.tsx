'use client'

import { useState } from 'react'
import { MapPin, Home, MoreVertical, Trash2, Pencil, CheckCircle2, Scroll, BriefcaseBusiness, Store, Popsicle, X, Check, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { AddressType } from '@prisma/client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { AddressFormValues, addressSchema } from '@/lib/validation/UserAddressSchema'
import { http } from '@/lib/http'

export const ManageAddressSection = ({ user }: any) => {
    const [editingId, setEditingId] = useState<string | null>(null)

    return (
        <div className="space-y-6 mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user?.addresses?.map((addr: any) => (
                    <AddressCard
                        key={addr.id}
                        addr={addr}
                        user={user}
                        isEditing={editingId === addr.id}
                        onEdit={() => setEditingId(addr.id)}
                        onCancel={() => setEditingId(null)}
                    />
                ))}

                {(!user?.addresses || user.addresses.length === 0) && (
                    <div className="col-span-full py-20 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center bg-muted/30">
                        <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                            <MapPin className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No addresses found</h3>
                        <Button variant="outline" className="mt-6">
                            Add your first address
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

// Internal Component for the Card to manage its own Form state
const AddressCard = ({ addr, user, isEditing, onEdit, onCancel }: any) => {
    const router = useRouter();
    const queryClient = useQueryClient()
    const isDefault = user.billingAddressId === addr.id

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema) as any,
        defaultValues: {
            name: addr.name ? addr.name : user.organizationName ? user.organizationName : user.name  ?? "",
            email: addr.email || "",
            phoneNumber: addr.phoneNumber || "",
            zipCode: addr.zipCode || "",
            type: addr.type || "",
            street: addr.street || "",
            city: addr.city || "",
            state: addr.state || "",
            isDefault: isDefault ?? false,
        },
    })

    const { mutate: updateAddress, isPending } = useMutation({
        mutationFn: async (values: AddressFormValues) => {
            const response = await http.patch(`/api/user/address/${addr.id}`, values);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            toast.success("Address updated successfully");
            onCancel();
        },
        onError: (error: any) => {
            toast.error(error.response?.data || "Something went wrong");
        },
    });

    const { mutate: deleteAddress, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            return await http.delete(`/api/user/address/${addr.id}`);
        },
        onSuccess: () => {
            toast.success("Address removed successfully");
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
        onError: (error: any) => {
            const message = error.response?.data || "Failed to delete address";
            toast.error(message);
        }
    });

    const { mutate: setAsDefault, isPending: isSettingDefault } = useMutation({
        mutationFn: async () => {

            return await http.patch(`/api/user/address/${addr.id}`, {
                ...addr,
                isDefault: true
            });
        },
        onSuccess: () => {
            toast.success("Default billing address updated");
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
        onError: () => {
            toast.error("Failed to update default address");
        }
    });

    const onSubmit = (values: AddressFormValues) => {
        updateAddress(values);
    };

    return (
        <Card className={cn(
            "relative overflow-hidden transition-all border-2",
            isDefault ? "border-primary bg-primary/5" : "border-border",
            isEditing && "ring-2 ring-primary ring-offset-2 shadow-xl lg:col-span-2"
        )}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "p-2 rounded-lg",
                        isDefault ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    )}>
                        {addr.type === AddressType.HOME && <Home size={18} /> ||
                            addr.type === AddressType.BILLING && <Scroll size={18} /> ||
                            addr.type === AddressType.WORK && <BriefcaseBusiness size={18} /> ||
                            addr.type === AddressType.SHIPPING && <Store size={18} /> ||
                            addr.type === AddressType.OTHER && <Popsicle size={18} />}
                    </div>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">
                        {isEditing ? `Editing ${addr.type}` : addr.type}
                    </CardTitle>
                </div>

                {!isEditing ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {!isDefault && (
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    disabled={isSettingDefault || isDefault}
                                    onClick={() => setAsDefault()}
                                >
                                    {isSettingDefault ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                    )}
                                    {isDefault ? "Current Default" : "Set as Default"}
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                disabled={isDeleting || isDefault}
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this address?")) {
                                        deleteAddress();
                                    }
                                }}
                                className="cursor-pointer text-destructive focus:text-destructive"
                            >
                                {isDeleting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={onCancel}>
                            <X size={16} />
                        </Button>
                        <Button size="icon" variant="default" className="h-8 w-8 bg-green-600 hover:bg-green-700" onClick={form.handleSubmit(onSubmit)}>
                            <Check size={16} />
                        </Button>
                    </div>
                )}
            </CardHeader>

            <CardContent className="pt-4">
                {isEditing ? (
                    <Form {...form}>
                        <form className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <Input {...field} placeholder="Enter Billing Name" className="h-8 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <Input {...field} placeholder="Enter Email" className="h-8 text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <Input {...field} placeholder="Enter Phone Number" className="h-8 text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <Input {...field} placeholder="Street" className="h-8 text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Address Types
                                                    </SelectLabel>
                                                    {Object.values(AddressType).map((type) => (
                                                        <SelectItem key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <Input {...field} disabled placeholder="City" className="h-8 text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <Input {...field} disabled placeholder="state" className="h-8 text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <Input {...field} placeholder="Pincode" className="h-8 text-xs" />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                ) : (
                    <div className="space-y-1 text-sm">
                        <p className="font-semibold text-foreground">{addr.name ? addr.name : user.organizationName ? user.organizationName : user.name  ?? ""}</p>
                        <p className="text-muted-foreground leading-relaxed">
                            {addr.street}<br />
                            {addr.city}, {addr.state} - {addr.zipCode}
                        </p>
                        <p className="text-xs text-muted-foreground pt-2">
                            <span className="font-medium">Phone:</span> {addr.phoneNumber || user.phoneNumber}
                        </p>
                        {isDefault && (
                            <Badge variant="secondary" className="text-[9px] px-1 h-4 mt-2 bg-primary/10 text-primary border-none uppercase font-bold">Default Billing</Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}