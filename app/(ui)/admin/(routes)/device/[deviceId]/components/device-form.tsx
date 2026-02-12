"use client"

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react"
import { DeviceModel, DeviceStatus } from "@prisma/client"
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
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label'


interface DeviceInterface {
    id: string;
    name: string;
    serialNo: string;
    status: DeviceStatus;
    apiKey: string;
    modelId: string;
    modelName: string;
    user: string;
    lat: string;
    lng: string;
    createdAt: Date;
}

interface DevicePops {
    initialData: DeviceInterface | null
}

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    serialNo: z.string().min(2, "Serial Number is required"),
    modelId: z.string().min(2, "Model is required"),
    apiKey: z.string(),
    lat: z.string().optional(),
    lng: z.string().optional(),
    user: z.string().optional(),
    status: z.enum(DeviceStatus).optional()
});



type DeviceFormValues = z.infer<typeof formSchema>

export const DeviceForm = ({ initialData }: DevicePops) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isUserMode, setIsUserMode] = useState(false);

    const [deviceModel, setDeviceModel] = useState<DeviceModel[]>()

    const title = initialData ? "Edit Device" : "Create Device";
    const description = initialData ? "Edit a Device" : "Add a new Device";
    const toastMsg = initialData ? "Device updated." : "Device created.";
    const action = initialData ? "Save Changes" : "Create";

    useEffect(() => {
        const getDeviceModels = async () => {
            const deviceModels = await http.get('/api/admin/device-model')
            setDeviceModel(deviceModels.data)
        }
        getDeviceModels();
    }, [])


    const form = useForm<DeviceFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            serialNo: initialData?.serialNo ?? "",
            modelId: initialData?.modelId ?? "",
            apiKey: initialData?.apiKey ?? '',
            status: initialData?.status ? DeviceStatus[initialData.status as keyof typeof DeviceStatus] : "UNASSIGNED",
            lat: initialData?.lat ?? "",
            lng: initialData?.lng ?? "",
            user: initialData?.user ?? ""
        },
    });
    // console.log(form.formState.errors);

    const onSubmit = async (data: DeviceFormValues) => {
        try {
            setLoading(true);

            if (!initialData && !data.name) {
                form.setError("name", { message: "NAME cannot be empty for new DEVICE" });
                return;
            }

            if (!initialData && !data.apiKey) {
                form.setError("apiKey", { message: "APIKEY cannot be empty for new DEVICE" });
                return;
            }

            if (!initialData && !data.serialNo) {
                form.setError("serialNo", { message: "SERIAL NUMBER cannot be empty for new DEVICE" });
                return;
            }

            if (!initialData && !data.modelId) {
                form.setError("modelId", { message: "MODEL cannot be empty for new DEVICE" });
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
            const res = await axios.delete(`/api/admin/device/${params.deviceId}`);

            if (res.status === 200) {
                toast.success(res.data.message || "Device deleted successfully");
                router.push(`/admin/device`);
            } else if (res.status === 401) {
                toast.error("You are not authorized to perform this action");
            } else if (res.status === 400) {
                toast.error("Invalid Serial ID or Model ID not found");
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

                {initialData && (<div className="flex flex-row gap-4">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="user-mode">User Mode</Label>
                        <Switch
                            id="user-mode"
                            checked={isUserMode}
                            onCheckedChange={setIsUserMode}
                        />
                    </div>
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => { setOpen(true) }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
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
                                    <FormLabel>Device Name</FormLabel>
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
                                        <Input type="text" placeholder="Serial No." disabled={loading} {...field} />
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
                            name="apiKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-red-500">APIKEY</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="EX.- AYAN1452AYAN"
                                            disabled={initialData ? true : loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Use a strong API KEY to secure your device data
                                        <span className="text-red-500 pl-1 font-bold">
                                            And It is a non-editable Field.
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {deviceModel && (
                            <FormField
                                control={form.control}
                                name="modelId"
                                render={({ field }) => {
                                    const selectedModel = deviceModel.find((m) => m.id === field.value);

                                    return (
                                        <FormItem>
                                            <FormLabel>Model</FormLabel>

                                            <Select
                                                disabled={loading}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select model" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    {deviceModel.map((item) => (
                                                        <SelectItem key={item.id} value={item.id}>
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FormDescription>
                                                {selectedModel?.description || "No description available"}
                                            </FormDescription>

                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}

                        {
                            isUserMode && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="user"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name of the Device user</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="XYZ" disabled={loading} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is Device User.
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
                                                    <Input placeholder="Latitude" disabled={loading} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is your public display latitude.
                                                </FormDescription>
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
                                                    <Input placeholder="Longitude" disabled={loading} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is your public display longitude.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Device State</FormLabel>
                                                <Select
                                                    disabled={loading}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Device status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={DeviceStatus.ASSIGNED}>
                                                            ASSIGNED
                                                        </SelectItem>
                                                        <SelectItem value={DeviceStatus.UNASSIGNED}>
                                                            UNASSIGNED
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription className="text-red-500">
                                                    If you register user from the admin pannel Select Assigned.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )
                        }

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