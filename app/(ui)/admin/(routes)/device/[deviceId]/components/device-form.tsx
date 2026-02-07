"use client"

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react"
import { Device } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


interface DeviceInterface {
    id: string;
    serialNo: string;
    name: string;
    model: {
        name: string;
    };
}

interface DevicePops {
    initialData: DeviceInterface | null
}

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    serialNo: z.string().min(2, "Serial Number is required"),
    model: z.string().min(2, "Model is required"),
});



type DeviceFormValues = z.infer<typeof formSchema>

export const DeviceForm = ({ initialData }: DevicePops) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Device" : "Create Device";
    const description = initialData ? "Edit a Device" : "Add a new Device";
    const toastMsg = initialData ? "Device updated." : "Device created.";
    const action = initialData ? "Save Changes" : "Create";


    const form = useForm<DeviceFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
        },
    });
    // console.log(form.formState.errors);

    const onSubmit = async (data: DeviceFormValues) => {
        try {
            setLoading(true);

            if (!initialData && !data.name) {
                form.setError("name", {
                    message: "NAME cannot be empty for new DEIVCE",
                });
                return;
            }

            if (!initialData && !data.serialNo) {
                form.setError("serialNo", {
                    message: "SERIAL NUMBER cannot be empty for new DEIVCE",
                });
                return;
            }

            if (!initialData && !data.model) {
                form.setError("model", {
                    message: "MODEL cannot be empty for new DEIVCE",
                });
                return;
            }

            let res;

            if (initialData) {
                res = await http.patch(`/api/admin/device/${params.deviceId}`, data);
            } else {
                res = await http.post(`/api/admin/device`, data);
            }

            const status = res.status;
            const message = res.data.message

            switch (status) {
                case 200:
                    toast.success(toastMsg);
                    form.reset();
                    router.push('/admin/device');
                    break;

                case 201:
                    toast.success(toastMsg);
                    form.reset();
                    router.push('/admin/device');
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
            const res = await axios.delete(`/api/admin/device/${params.writerId}`);

            if (res.status === 200) {
                toast.success(res.data.message || "Device deleted successfully");
                router.push(`/admin/device`);
            }
            else if (res.status === 409) {
                toast.error(res.data.message || "Please delete all blogs written by this Device first");
            } else if (res.status === 401) {
                toast.error("You are not authorized to perform this action");
            } else if (res.status === 400) {
                toast.error("Invalid Device ID or ID not found");
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
                                        <Input placeholder="Device Name" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display Device Name.
                                    </FormDescription>
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
                                    <FormDescription>
                                        This is your public display serial no.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={"Mobile"}>
                                                Mobile
                                            </SelectItem>
                                            <SelectItem value={"PC"}>
                                                Computer
                                            </SelectItem>
                                            <SelectItem value={"Web"}>
                                                Web
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Controls whether the writer can publish content.
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