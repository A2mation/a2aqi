"use client"

import * as z from "zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash, Check, ChevronsUpDown, X } from "lucide-react"
import { Monitor, MonitorStatus, MonitorTag, Device } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

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
    FormDescription,
} from "@/components/ui/form"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/Heading"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import AlertModal from "@/components/modals/alert-modal";
import { http } from "@/lib/http";
import { MonitorDetailsFormSchema } from "@/lib/validation/MonitorDetails.schema";
import { cn } from "@/lib/utils";

type MonitorFormValues = z.infer<typeof MonitorDetailsFormSchema>

interface MonitorFormProps {
    initialData: (Monitor & { devices?: { deviceId: string }[] }) | null;
}

export const MonitorForm = ({ initialData }: MonitorFormProps) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const { data: availableDevices = [], isLoading: availableloadingDevices } = useQuery<Device[]>({
        queryKey: ["available-devices", initialData?.id],
        queryFn: async () => {
            const res = await http.get(`/api/admin/monitor/device/available-devices?monitorId=${initialData?.id}`);
            return res.data;
        },
        enabled: !!initialData,
    });

    const { data: assignedDevice = [], isLoading: assignedloadingDevices } = useQuery<Device[]>({
        queryKey: ["assigned-devices", initialData?.id],
        queryFn: async () => {
            const res = await http.get(`/api/admin/monitor/device/assigned-devices?monitorId=${initialData?.id}`);
            return res.data;
        },
        enabled: !!initialData,
    });

    const loadingDevices = availableloadingDevices || assignedloadingDevices;


    const allDevices = Array.from(
        new Map([...availableDevices, ...assignedDevice].map(item => [item.id, item])).values()
    );
    console.log(availableDevices, assignedDevice)


    const title = initialData ? "Edit Monitor" : "Create Monitor";
    const description = initialData ? "Edit monitor details and device assignments" : "Add a new monitor and assign devices";
    const action = initialData ? "Save Changes" : "Create Monitor";

    const form = useForm<MonitorFormValues>({
        resolver: zodResolver(MonitorDetailsFormSchema) as any,
        defaultValues: initialData ? {
            name: initialData.name,
            email: initialData.email,
            status: initialData.status,
            tag: initialData.tag,
            password: "",
            deviceIds: initialData ? initialData?.devices?.map(d => d.deviceId) : [],
        } : {
            name: "",
            email: "",
            password: "",
            status: MonitorStatus.ACTIVE,
            tag: MonitorTag.PRIVATE,
            deviceIds: [],
        },
    });

    const onSubmit = async (values: MonitorFormValues) => {
        try {
            setLoading(true);
            const payload = { ...values };

            if (initialData && !payload.password) delete payload.password;
            if (!initialData && !payload.password) {
                toast.error("Password is required for new monitors");
                return;
            }

            if (initialData) {
                await http.patch(`/api/admin/monitor/${params.monitorId}`, payload);
            } else {
                await http.post(`/api/admin/monitor`, payload);
            }

            form.reset();
            toast.success(initialData ? "Monitor updated" : "Monitor created");
            router.push('/admin/monitor');
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (assignedDevice.length > 0 && initialData) {
            const assignedIds = assignedDevice.map(d => d.id);

            const currentValues = form.getValues("deviceIds") || [];
            const uniqueIds = Array.from(new Set([...currentValues, ...assignedIds]));

            form.setValue("deviceIds", uniqueIds);
        }
    }, [assignedDevice, form, initialData]);

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={() => { }} loading={loading} />
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
                                <FormLabel>Monitor Name</FormLabel>
                                <FormControl><Input placeholder="Full name" disabled={loading} {...field} /></FormControl>
                                <FormDescription>
                                    Monitor Display Name
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
                                    Email Must be Unique.
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
                                    {
                                        initialData
                                            ? "Only fill this if you want to change the password."
                                            : "This will be your new writer password."
                                    }
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Status Select */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(MonitorStatus).map((status) => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Tag Select */}
                        <FormField
                            control={form.control}
                            name="tag"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Access Tag</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select tag" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(MonitorTag).map((tag) => (
                                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Separator />

                    {/* Device Assignment Section */}
                    {initialData && <div className="space-y-4">
                        <div className="flex flex-col gap-4 mb-5">
                            <Heading
                                title="Device Assignments"
                                description="Select devices this monitor is allowed to manage."
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="deviceIds"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn("w-full md:w-100 justify-between", !field.value?.length && "text-muted-foreground")}
                                                    disabled={loading || loadingDevices || assignedloadingDevices}
                                                >
                                                    {loadingDevices ? "Loading devices..." : "Select devices..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-100 p-0">
                                            <Command>
                                                <CommandInput placeholder="Search device by name or serial..." />
                                                <CommandList>
                                                    <CommandEmpty>No device found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {allDevices.map((device) => (
                                                            <CommandItem
                                                                value={device.id}
                                                                key={device.id}
                                                                onSelect={() => {
                                                                    const currentIds = field.value || [];
                                                                    const nextIds = currentIds.includes(device.id)
                                                                        ? currentIds.filter((id) => id !== device.id)
                                                                        : [...currentIds, device.id];
                                                                    form.setValue("deviceIds", nextIds);
                                                                }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", field.value?.includes(device.id) ? "opacity-100" : "opacity-0")} />
                                                                {device.serialNo}
                                                                <span className="ml-2 text-xs text-muted-foreground">({device.serialNo})</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    {/* Visual Badges for Selected Devices */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {field.value?.map((id) => {
                                            const device = allDevices.find((d) => d.id === id);
                                            if (!device) return null;
                                            return (
                                                <Badge key={id} variant="secondary" className="pl-3 pr-1 py-1 gap-1">
                                                    {device.name}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-4 w-fit p-2 hover:bg-transparent"
                                                        onClick={() => field.onChange(field.value.filter((val) => val !== id))}
                                                    >
                                                        {device.serialNo}
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>}

                    <div className="flex items-center gap-4">
                        <Button disabled={loading} className="ml-auto" type="submit">
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}