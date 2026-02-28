"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Save, ArrowLeft, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { deviceSchema, type DeviceFormValues } from "./schema/schema";
import { formatDateTime } from "@/utils/formatDateTime";



const EditDeviceContent = () => {
    const router = useRouter();
    const {
        deviceId
    } = useParams();
    const queryClient = useQueryClient();

    const { data: device, isLoading } = useQuery({
        queryKey: ["device", deviceId],
        queryFn: async () => {
            const res = await axios.get(`/api/user/device?deviceId=${deviceId}`);
            return res.data;
        },
    });

    const form = useForm<DeviceFormValues>({
        resolver: zodResolver(deviceSchema) as any,
        defaultValues: {
            name: "",
            serialNo: "",
            isActive: true,
            type: "OUTDOOR",
            assignedAt: "UNASSIGNED",
            loaction: "",
            lat: "",
            lng: "",
        },
    });

    useEffect(() => {
        if (device) {
            form.reset({
                name: device.name ?? "",
                serialNo: device.serialNo,
                isActive: Boolean(device.isActive),
                type: device.type,
                assignedAt: device.assignedAt,
                loaction: device.loaction ?? "",
                lat: device.lat?.toString() ?? "",
                lng: device.lng?.toString() ?? "",
            });
        }
    }, [device, form]);

    // --- Geolocation Helper ---
    const handleDetectLocation = () => {
        if (!("geolocation" in navigator)) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        const loadingToast = toast.loading("Detecting location...");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                // Setting as strings as requested
                form.setValue("lat", pos.coords.latitude.toString(), { shouldDirty: true });
                form.setValue("lng", pos.coords.longitude.toString(), { shouldDirty: true });
                toast.success("Location detected! 📍", { id: loadingToast });
            },
            (err) => {
                toast.error(err.message || "Failed to get location", { id: loadingToast });
            }
        );
    };

    const { mutate: updateDevice, isPending: isUpdating } = useMutation({
        mutationFn: async (values: DeviceFormValues) => {
            return await axios.patch(`/api/user/device?deviceId=${deviceId}`, values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["device", deviceId] });
            toast.success("Device settings updated");
        },
        onError: () => toast.error("Failed to update device"),
    });

    if (isLoading) return <EditDeviceSkeleton />;

    return (
        <div className="p-4 ">
            <Button variant="ghost" onClick={() => router.back()} className="mb-2 gap-2 cursor-pointer">
                <ArrowLeft className="w-4 h-4" /> Back to Devices
            </Button>

            <Card className="shadow-md">
                <CardHeader className="bg-muted/20 border-b">
                    <CardTitle>Edit Device: {device?.serialNo}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((v) => updateDevice(v))} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter device name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            <FormDescription>
                                                Friendly name of your device.
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="serialNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serial Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled className="bg-muted" />
                                            </FormControl>

                                            <FormDescription>
                                                Hardware specific so you cannot change it.
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Coordinates Grid with Detect Button */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <FormLabel className="text-base"> <MapPin className="w-4 h-4" color="red" />
                                            Coordinates

                                            <span className="text-sm text-red-500">(Use Phone for Better accuracy)</span>
                                        </FormLabel>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDetectLocation}
                                        className="gap-2"
                                    >
                                        <MapPin className="w-4 h-4" color="red" />
                                        Detect Location
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="lat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Latitude</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0.0000" disabled {...field} />
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
                                                    <Input placeholder="0.0000" disabled {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* ... Other fields (Selects, Location, Switch) remain the same ... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Device Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="INDOOR">Indoor</SelectItem>
                                                    <SelectItem value="OUTDOOR">Outdoor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="assignedAt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Assignment At</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Device Assigned time" disabled {...field} value={formatDateTime(field.value) || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="loaction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Physical address or room..." {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/10">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base font-medium">Active Status</FormLabel>
                                            <FormDescription>Disable to pause data aggregation.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} disabled onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full h-12" disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                Save Changes
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

// Skeleton Loader for better UX
function EditDeviceSkeleton() {
    return (
        <div className="h-screen p-4">
            <Skeleton className="h-10 w-32" />
            <Card>
                <CardHeader className="border-b"><Skeleton className="h-8 w-64" /></CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-2 gap-6">
                        <Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

export default EditDeviceContent;