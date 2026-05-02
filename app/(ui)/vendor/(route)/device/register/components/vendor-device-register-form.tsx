"use client";

import * as z from "zod";
import { toast } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { ChevronsUpDown, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DeviceStatus, vendorDeviceFormSchema } from "@/lib/validation/vendor/vendor.device.registration.schema";



type DeviceFormValues = z.infer<typeof vendorDeviceFormSchema>;



export const DeviceForm = () => {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const toastMessage = "Device registered.";
    const action = "Register";

    // TODO: NEED to add the URLS
    const { data: deviceModels = [] } = useQuery({
        queryKey: ["device-models"],
        queryFn: async () => {
            const res = await http.get("/api/vendor/device-models");
            if (res.status == 200) {
                return res.data;
            }
            throw new Error(res.data.message || 'Something Went Wrong');
        }
    });

    const { data: users } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await http.get("/api/vendor/users");
            if (res.status == 200) {
                return res.data;
            }
            throw new Error(res.data.message || 'Something Went Wrong');
        }
    });

    const form = useForm < DeviceFormValues > ({
        resolver: zodResolver(vendorDeviceFormSchema) as any,
        defaultValues: {
            name: "",
            modelId: "",
            status: DeviceStatus.UNASSIGNED,
            lat: "",
            lng: "",
            user: "",
        },
    });

    const { mutate: saveDevice, isPending: loading } = useMutation({
        mutationFn: async (values: DeviceFormValues) => {

            return await http.post(`/api/vendor/device`, values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] });
            router.push(`/vendor/devices`);
            toast.success(toastMessage);
        },
        onError: () => {
            toast.error("Something went wrong. Please try again.");
        },
    });

    const onSubmit = (data: DeviceFormValues) => {
        saveDevice(data);
    };

    return (
        <section className="mt-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Device Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Warehouse Scanner 01" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="modelId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <Select
                                        disabled={loading || deviceModels?.length === 0}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={cn(
                                                "w-full",
                                                !field.value && "text-muted-foreground"
                                            )}>
                                                <SelectValue placeholder={deviceModels?.length === 0 ? "No models available" : "Select model"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {deviceModels && deviceModels.length > 0 ? (
                                                deviceModels.map((model: any) => (
                                                    <SelectItem key={model.id} value={model.id}>
                                                        {model.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none text-muted-foreground">
                                                    No models found
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        {/* Optional: Show a hint if no models are loaded */}
                                        {deviceModels?.length === 0 && "Contact admin to add device models."}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="user"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Assigned User</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? users?.find((u: any) => u.id === field.value)?.email
                                                        : "Select user..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search user..." />
                                                <CommandEmpty>No user found.</CommandEmpty>
                                                <CommandGroup>
                                                    {users?.map((user: any) => (
                                                        <CommandItem
                                                            value={user.email}
                                                            key={user.id}
                                                            onSelect={() => form.setValue("user", user.id)}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    user.id === field.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {user.email}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={DeviceStatus.ASSIGNED}>Assigned</SelectItem>
                                            <SelectItem value={DeviceStatus.UNASSIGNED}>Unassigned</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Coordinates */}
                        <FormField
                            control={form.control}
                            name="lat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Latitude</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0.000" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lng"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Longitude</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0.000" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </section>
    );
};