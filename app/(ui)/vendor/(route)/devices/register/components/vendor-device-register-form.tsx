"use client";

import * as z from "zod";
import { toast } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, Check, Loader2, AlertCircle } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { vendorDeviceFormSchema } from "@/lib/validation/vendor/vendor.device.registration.schema";

type DeviceFormValues = z.infer<typeof vendorDeviceFormSchema>;

export const DeviceForm = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const toastMessage = "Device registered.";
    const action = "Register";

    const {
        data: deviceModels,
        isLoading: isLoadingModels,
        isError: isModelsError
    } = useQuery({
        queryKey: ["vendor-device-models"],
        queryFn: async () => {
            const res = await http.get("/api/vendor/models");

            if (res.status === 200) {
                if (Array.isArray(res.data)) return res.data;
                return [];
            }

            throw new Error(res.data.message || 'Something Went Wrong')
        },
        initialData: [],
    });

    const {
        data: users,
        isLoading: isLoadingUsers,
        isError: isUsersError
    } = useQuery<any[]>({
        queryKey: ["vendor-users"],
        queryFn: async () => {
            const res = await http.get("/api/vendor/users");

            if (res.status === 200) {
                if (res.data && Array.isArray(res.data.users)) return res.data.users;
                return [];
            }

            throw new Error(res.data.message || 'Something Went Wrong')

        },
        initialData: [],
    });

    const form = useForm<DeviceFormValues>({
        resolver: zodResolver(vendorDeviceFormSchema),
        defaultValues: {
            name: "",
            modelId: "",
            location: '',
            lat: "",
            lng: "",
            user: "",
        },
    });

    const { mutate: saveDevice, isPending: isSubmitting } = useMutation({
        mutationFn: async (values: DeviceFormValues) => {
            const res =await http.post(`/api/vendor/devices`, values);
            if (!res.data.error && res.status === 200) {
                return res.data
            }
            throw new Error(res.data.message || 'Something went wrong');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-devices"] });
            router.push(`/vendor/devices`);
            toast.success(toastMessage);
        },
        onError: (error: any) => {
            toast.error(error?.data?.message || "Something went wrong.");
        },
    });

    const onSubmit = (data: DeviceFormValues) => {
        console.log(data)
        saveDevice(data);
    };

    const hasFetchError = isModelsError || isUsersError;
    const isInitialLoading = isLoadingModels || isLoadingUsers;

    const selectedModelId = form.watch("modelId");
    const selectedModel = deviceModels?.find((m: any) => m.id === selectedModelId);


    return (
        <section className="mt-10 max-w-7xl mx-auto p-6">
            {hasFetchError && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load form data. Please refresh the page to try again.
                    </AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Device Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Device Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Warehouse Scanner 01"
                                            disabled={isSubmitting || isInitialLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Model Selection */}
                        <FormField
                            control={form.control}
                            name="modelId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    {isLoadingModels ? (
                                        <Skeleton className="h-10 w-full" />
                                    ) : (
                                        <Select
                                            disabled={isSubmitting || !Array.isArray(deviceModels) || deviceModels.length === 0}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={deviceModels?.length === 0 ? "No models available" : "Select model"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Array.isArray(deviceModels) && deviceModels.map((model: any) => (
                                                    <SelectItem key={model.id} value={model.id}>
                                                        {model.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}

                                    {selectedModel?.parameters && (
                                        <FormDescription className="mt-3 p-3 border rounded-md bg-slate-50/50">
                                            <span className="text-xs font-semibold uppercase text-slate-500 block mb-2">
                                                Supported Parameters
                                            </span>
                                            <span className="flex flex-wrap gap-2">
                                                {selectedModel.parameters.map((param: string) => (
                                                    <code
                                                        key={param}
                                                        className="bg-white border text-primary px-2 py-1 rounded text-[11px] font-mono shadow-sm"
                                                    >
                                                        {param.toUpperCase()}
                                                    </code>
                                                ))}
                                            </span>
                                        </FormDescription>
                                    )}

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* User Selection */}
                        <FormField
                            control={form.control}
                            name="user"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Assigned User</FormLabel>
                                    {isLoadingUsers ? (
                                        <Skeleton className="h-10 w-full" />
                                    ) : (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        disabled={isSubmitting || users?.length === 0}
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
                                            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search user..." />
                                                    <CommandEmpty>No user found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {users.map((user: any) => (
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
                                    )}
                                    <FormDescription>
                                        {users.length === 0 && <span className="font-bold text-red-500">
                                            Please Add User First
                                        </span>}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Device location</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Mumbai"
                                            disabled={isSubmitting || isInitialLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Latitude */}
                        <FormField
                            control={form.control}
                            name="lat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Latitude</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0.000" disabled={isSubmitting || isInitialLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Longitude */}
                        <FormField
                            control={form.control}
                            name="lng"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Longitude</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0.000" disabled={isSubmitting || isInitialLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <Button disabled={isSubmitting || isInitialLoading} type="submit">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </section>
    );
};