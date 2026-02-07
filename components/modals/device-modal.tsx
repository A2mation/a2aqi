"use client"

import * as z from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useDeviceModal } from "@/hooks/use-device-store"

import { Modal } from "../ui/modal"

enum ModelProps {
    Mobile = "Mobile",
    Tablet = "Tablet",
    Desktop = "Desktop",
    Other = "Other",
}

const formSchema = z.object({
    deviceId: z.string().min(2).max(32),
    deviceName: z.string().min(2).max(32),
    modelName: z.enum(ModelProps),
    lat: z.string().min(2),
    long: z.string().min(2),
});

export const DeviceModal = () => {
    const deviceModal = useDeviceModal();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            deviceId: "",
            deviceName: "",
            modelName: ModelProps.Mobile,
            lat: "",
            long: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            console.log(data);
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return <>
        <Modal
            title="Add New Device"
            description="Add a new device to your account."
            isOpen={deviceModal.isOpen}
            onClose={deviceModal.onClose}
        >
            <div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                name="deviceId"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Device ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Device ID" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            You can find this
                                            <span className="text-red-500"> Device ID  </span>
                                            on the back of your device.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="deviceName"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Device Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Device Name" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            A friendly name to identify your device.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="modelName"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model Name</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={loading}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Model" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={ModelProps.Mobile}>Mobile</SelectItem>
                                                    <SelectItem value={ModelProps.Tablet}>Tablet</SelectItem>
                                                    <SelectItem value={ModelProps.Desktop}>Desktop</SelectItem>
                                                    <SelectItem value={ModelProps.Other}>Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Select the device model type you are registering.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                name="lat"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Latitude</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Latitude" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Provide the latitude coordinate of the device's location.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="long"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Longitude</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Longitude" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Provide the longitude coordinate of the device's location.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-x-2 pt-6 flex items-center justify-end w-full">
                                <Button
                                    variant="outline"
                                    onClick={deviceModal.onClose}
                                    disabled={loading}
                                    className=" cursor-pointer"
                                >
                                    Cancel
                                </Button>

                                <Button type="submit" className=" cursor-pointer" disabled={loading}>Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    </>

}