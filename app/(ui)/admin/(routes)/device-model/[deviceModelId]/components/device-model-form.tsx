"use client"

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react"
import { DeviceModel } from "@prisma/client"
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
    FormDescription,
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
import { Textarea } from "@/components/ui/textarea";


interface DeviceModelPops {
    initialData: Partial<DeviceModel> | null
}

const formSchema = z.object({
    name: z.string().min(2, "Name is required."),
    description: z.string().min(10, "Minimum 10 letters needed."),
    manufacturer: z.string().min(2, "Manufacturer name is required."),
    isActive: z.boolean()
});



type DeviceModelFormValues = z.infer<typeof formSchema>

export const DeviceModelForm = ({ initialData }: DeviceModelPops) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Device Model" : "Create Device Model";
    const description = initialData ? "Edit a Device Model" : "Add a new Device Model";
    const toastMsg = initialData ? "Device Model updated." : "Device Model created.";
    const action = initialData ? "Save Changes" : "Create";


    const form = useForm<DeviceModelFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            description: initialData?.description ?? "",
            manufacturer: initialData?.manufacturer ?? "",
            isActive: initialData?.isActive ?? true,

        },
    });
    // console.log(form.formState.errors);

    const onSubmit = async (data: DeviceModelFormValues) => {
        try {
            setLoading(true);

            if (!initialData && !data.name) {
                form.setError("name", {
                    message: "Name cannot be empty",
                });
                return;
            }

            if (!initialData && !data.description) {
                form.setError("description", {
                    message: "Description cannot be empty"
                })
            }

            if (!initialData && !data.manufacturer) {
                form.setError("manufacturer", {
                    message: "Manufacturer cannot be empty"
                })
            }


            let res;

            if (initialData) {
                res = await http.patch(`/api/admin/device-model/${params.deviceModelId}`, data);
            } else {
                res = await http.post(`/api/admin/device-model`, data);
            }

            const status = res.status;
            const message = res.data.message

            switch (status) {
                case 200:
                    toast.success(toastMsg);
                    form.reset();
                    router.push('/admin/device-model');
                    break;

                case 201:
                    toast.success(toastMsg);
                    form.reset();
                    router.push('/admin/device-model');
                    break;

                case 400:
                    toast.error(message || "Invalid input");
                    break;

                case 401:
                    toast.error("You are not authorized");
                    break;

                default:
                    toast.error("Something went wrong");
            }


        } catch (error: any) {
            toast.error("Unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };


    const onDelete = async () => {
        try {

            setLoading(true);
            const res = await axios.delete(`/api/admin/device-model/${params.deviceModelId}`);

            if (res.status === 200) {
                toast.success(res.data.message || "Device Model deleted successfully");
                router.push(`/admin/device-model`);
            }
            else if (res.status === 409) {
                toast.error(res.data.message || "Please delete all blogs written by this Device Model first");
            } else if (res.status === 401) {
                toast.error("You are not authorized to perform this action");
            } else if (res.status === 400) {
                toast.error("Invalid Device Model ID or ID not found");
            }

        } catch (error) {
            toast.error("Unexpected error occurred");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex justify-between items-center">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => { setOpen(true) }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Device Model Name" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display Device Model Name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="manufacturer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manufacturer</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Device Model Manufacturer"
                                            className="cursor-none"
                                            disabled={
                                                initialData ? true : loading
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {
                                            initialData
                                                ? `Manufacturer cannot be edited.`
                                                : `This is your public display Device Model Manufacturer.`
                                        }

                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>

                                    <Select
                                        disabled={loading}
                                        onValueChange={(value) => field.onChange(value === "true")}
                                        value={field.value ? "true" : "false"}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectItem value="true">Active</SelectItem>
                                            <SelectItem value="false">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <FormDescription>
                                        Controls whether the Device Model can publish content.
                                    </FormDescription>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Device Model description"
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-red-600">
                                        Please elaborately mention which model contains which fields.
                                        (EX: AQI, PM2.5, So2 etc.)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />




                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading}
                            className=" hover:cursor-pointer "
                        >
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
            <Separator />


        </>
    )
}