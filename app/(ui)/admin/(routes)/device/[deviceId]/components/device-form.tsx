"use client"

import * as z from "zod";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Check, ChevronsUpDown, Loader2, Settings2, Trash } from "lucide-react"
import { DeviceStatus, DeviceModel, User } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";

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
import { Label } from '@/components/ui/label'
import { useDebounce } from "@/hooks/use-debounce";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Define the Schema First
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    serialNo: z.string().min(1, "Serial number is required"),
    modelId: z.string().min(1, "Model selection is required"),
    apiKey: z.string().min(1, "API Key is required"),
    status: z.enum(DeviceStatus),
    isUserMode: z.boolean().default(false),
    lat: z.string().optional().default(""),
    lng: z.string().optional().default(""),
    user: z.string().optional().default(""),
}).superRefine((data, ctx) => {
    if (data.isUserMode && (!data.user || data.user.trim() === "")) {
        ctx.addIssue({
            code: "custom",
            message: "User selection is mandatory when User Mode is active",
            path: ["user"],
        });
    }
});

// Infer the type from the Schema
type DeviceFormValues = z.infer<typeof formSchema>;

interface DevicePops {
    initialData: {
        id: string;
        name: string;
        serialNo: string;
        status: DeviceStatus;
        apiKey: string;
        modelId: string;
        modelName: string;
        userId: string;
        username: string;
        email: string;
        lat: string;
        lng: string;
        createdAt: Date;
    } | null;
}

export const DeviceForm = ({ initialData }: DevicePops) => {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 400);

    const [open, setOpen] = useState(false);

    const title = initialData ? "Edit Device" : "Create Device";
    const description = initialData ? "Edit device details" : "Add a new device";

    // Initialize useForm with the inferred type
    const form = useForm<DeviceFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: initialData ? {
            name: initialData.name || "",
            serialNo: initialData.serialNo || "",
            modelId: initialData.modelId || "",
            apiKey: initialData.apiKey || "",
            status: initialData.status || DeviceStatus.UNASSIGNED,
            isUserMode: !!initialData.userId,
            lat: initialData.lat || "",
            lng: initialData.lng || "",
            user: initialData.userId || "",
        } : {
            name: "",
            serialNo: "",
            modelId: "",
            apiKey: "",
            status: DeviceStatus.UNASSIGNED,
            isUserMode: false,
            lat: "",
            lng: "",
            user: "",
        },
    });

    const isUserMode = form.watch("isUserMode");
    const action = initialData ? "Save Changes" : "Create";



    const { data: deviceModel, isLoading: loadingModels } = useQuery<DeviceModel[]>({
        queryKey: ["device-models"],
        queryFn: async () => (await http.get('/api/admin/device-model/active-device-model')).data
    });

    const {
        data: userPages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: loadingUsers
    } = useInfiniteQuery({
        queryKey: ["users-infinite", debouncedSearch],
        // 1. Explicitly type the context parameter
        queryFn: async ({ pageParam }: { pageParam: string | null }) => {
            const response = await http.get<{
                users: { id: string; name: string; email: string }[];
                nextCursor: string | null;
            }>('/api/admin/user', {
                params: {
                    search: debouncedSearch,
                    cursor: pageParam,
                    limit: 10,
                },
            });
            return response.data;
        },

        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });


    const allUsers = userPages?.pages.flatMap((page) => page.users || []).filter(Boolean) ?? [];

    const { mutate: saveDevice, isPending: isSaving } = useMutation({
        mutationFn: async (values: DeviceFormValues) => {
            const submissionData = { ...values };

            if (!values.isUserMode) {
                submissionData.user = "";
                submissionData.lat = "";
                submissionData.lng = "";
            }

            if (initialData) {
                return await http.patch(`/api/admin/device/${params.deviceId}`, submissionData);
            }
            return await http.post(`/api/admin/device`, submissionData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] });
            toast.success("Success!");
            router.push('/admin/device');
            router.refresh();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    });

    const { mutate: deleteDevice, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            await http.delete(`/api/admin/device/${params.deviceId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] });
            toast.success("Device deleted");
            router.push(`/admin/device`);
            router.refresh();
        },
        onError: () => {
            toast.error("Failed to delete device");
        },
        onSettled: () => setOpen(false)
    });

    const loading = isSaving || isDeleting || loadingModels || loadingUsers;

    const onSubmit = (data: DeviceFormValues) => {
        saveDevice(data);
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => deleteDevice()}
                loading={isDeleting}
            />
            <div className="flex justify-between items-center">
                <Heading title={title} description={description} />
                <div className="flex flex-row gap-4 items-center">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="user-mode">User Mode</Label>
                        <Switch
                            id="user-mode"
                            checked={isUserMode}
                            onCheckedChange={(checked) => form.setValue("isUserMode", checked)}
                        />
                    </div>
                    {initialData && (
                        <>
                            <Button asChild variant="outline">
                                <Link href={`/admin/device/${params.deviceId}/calibration`}>
                                    <Settings2 className="mr-2 h-4 w-4" />
                                    Calibration
                                </Link>
                            </Button>
                            <Button
                                disabled={loading}
                                variant="destructive"
                                size="icon"
                                onClick={() => setOpen(true)}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <Separator className="my-4" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Device Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Device Name" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serialNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Serial No.</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Serial No." disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="apiKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-red-500 font-bold">API KEY</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="EX.- AYAN1452AYAN"
                                            disabled={!!initialData || loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-red-500 font-semibold">
                                        Non-editable once created.
                                    </FormDescription>
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
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select model" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {deviceModel?.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormDescription>
                                        {deviceModel?.find((m) => m.id === field.value)?.description || "No description available"}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isUserMode && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="user"
                                    render={({ field }) => {

                                        const sortedUsers = useMemo(() => {

                                            if (!field.value) return allUsers;

                                            const selected = allUsers.find((u) => u?.id === field.value);
                                            const others = allUsers.filter((u) => u?.id !== field.value);

                                            // Pin selected to top, then add the rest
                                            return selected ? [selected, ...others] : allUsers;
                                        }, [userPages, field.value]);
                                        return (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Device User</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                                {field.value ? sortedUsers.find(u => u.id === field.value)?.email : "Select User..."}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-100 p-0">
                                                        <Command shouldFilter={false}> {/* Disable local filtering */}
                                                            <CommandInput
                                                                placeholder="Search by email..."
                                                                value={searchQuery}
                                                                onValueChange={setSearchQuery}
                                                            />
                                                            <CommandList className="max-h-75 overflow-y-auto">
                                                                <CommandEmpty>{loading ? "Searching..." : "No user found."}</CommandEmpty>

                                                                <CommandGroup>
                                                                    {sortedUsers.map((user) => (
                                                                        <CommandItem
                                                                            key={user.id}
                                                                            value={user.id}
                                                                            onSelect={() => {
                                                                                form.setValue("user", user.id);
                                                                            }}
                                                                        >
                                                                            <Check className={cn("mr-2 h-4 w-4", user.id === field.value ? "opacity-100 text-green-500" : "opacity-0")} />
                                                                            <div className="flex flex-col">
                                                                                <span>{user.email}</span>
                                                                                <span className="text-xs text-muted-foreground">{user.name}</span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>

                                                                {/* Infinite Scroll Trigger */}
                                                                {hasNextPage && (
                                                                    <div className="p-2 flex justify-center">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            disabled={isFetchingNextPage}
                                                                            onClick={() => fetchNextPage()}
                                                                        >
                                                                            {isFetchingNextPage ? <Loader2 className="animate-spin h-4 w-4" /> : "Load More"}
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription>
                                                    {field.value ? `Name : ${sortedUsers.find(u => u.id === field.value)?.name}` : "Please select user"}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Device Status</FormLabel>
                                            <Select
                                                disabled={loading}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={DeviceStatus.ASSIGNED}>ASSIGNED</SelectItem>
                                                    <SelectItem value={DeviceStatus.UNASSIGNED}>UNASSIGNED</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                {field.value === DeviceStatus.ASSIGNED
                                                    ? "The device is active and linked to a specific user."
                                                    : field.value === DeviceStatus.UNASSIGNED
                                                        ? "The device will be moved to the inventory pool and removed from the current user."
                                                        : "Choose the current operational state of this hardware."}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Latitude</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0.0000" disabled={loading} {...field} />
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
                                                <Input placeholder="0.0000" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                            </>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading}>
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
            <Separator className="my-4" />
        </>
    )
}