"use client"

import * as z from "zod"
import toast from "react-hot-toast"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { useDeviceLookup } from "@/hooks/useDeviceLookup"
import { Modal } from "../ui/modal"
import { DeviceModel } from "@/types/devices"
import { http } from "@/lib/http"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    serialNo: z.string().min(2, "Device ID is required").max(32),
    deviceName: z.string().min(2, "Device name is required").max(32),
    modelId: z.string().min(1, "Model is required"),
    lat: z.string().min(2, "Latitude is required"),
    long: z.string().min(2, "Longitude is required"),
})

type FormValues = z.infer<typeof formSchema>

export const DeviceModal = () => {
    const router = useRouter();
    const deviceModal = useDeviceModal()
    const queryClient = useQueryClient()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serialNo: "",
            deviceName: "",
            modelId: "",
            lat: "",
            long: "",
        },
    })

    const { watch, setValue, reset } = form
    const serialNo = watch("serialNo")
    const modelId = watch("modelId")

    /* ===============================
       DEVICE LOOKUP HOOK
    =============================== */

    const {
        isFetching: isCheckingDevice,
        isFound: isDeviceFound,
        isError: isDeviceError,
        errorMessage: deviceErrorMessage,
    } = useDeviceLookup(serialNo, setValue)

    // console.log(isDeviceError, deviceErrorMessage)

    /* ===============================
       FETCH MODELS
    =============================== */

    const { data: modelsData } = useQuery<DeviceModel[]>({
        queryKey: ["device-models"],
        queryFn: async () => {
            const { data } = await http.get("/api/user/device/models")
            return data.models
        },
    })

    const registerMutation = useMutation({
        mutationFn: async (data: FormValues) => {
            return http.patch(`/api/user/device/${serialNo}`, data)
        },

        onMutate: async (newDevice) => {
            await queryClient.cancelQueries({
                queryKey: ["user-devices"],
            })

            const previousDevices = queryClient.getQueryData([
                "user-devices",
            ])

            queryClient.setQueryData(
                ["user-devices"],
                (old: any[] = []) => [
                    ...old,
                    {
                        ...newDevice,
                        id: `temp-${Date.now()}`,
                        optimistic: true,
                    },
                ]
            )

            return { previousDevices }
        },

        onError: (_err, _newDevice, context) => {
            if (context?.previousDevices) {
                queryClient.setQueryData(
                    ["user-devices"],
                    context.previousDevices
                )
            }
            toast.error("Failed to register device")
        },

        onSuccess: (response) => {
            const { id } = response.data

            toast.success("Device added successfully 🎉")

            queryClient.invalidateQueries({
                queryKey: ["user-devices"],
            })

            reset();
            deviceModal.onClose();

            router.push(`/user/${id}/dashboard`)
        },
    })

    /* ===============================
       SUBMIT DISABLE LOGIC
    =============================== */

    const isSubmitDisabled =
        registerMutation.isPending ||
        !modelId ||
        isCheckingDevice ||
        isDeviceError

    return (
        <Modal
            title="Add New Device"
            description="Add a new device to your account."
            isOpen={deviceModal.isOpen}
            onClose={deviceModal.onClose}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((data) =>
                        registerMutation.mutate(data)
                    )}
                    className="space-y-4"
                >
                    {/* Serial No. */}
                    <FormField
                        name="serialNo"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Serial No.</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            className={`
                                                ${isDeviceFound ? "border-green-500 focus-visible:ring-green-500" : ""}
                                                ${isDeviceError ? "border-red-500 focus-visible:ring-red-500" : ""}
                                            `}
                                            disabled={isDeviceFound}
                                        />


                                        {isCheckingDevice && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <div className="h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </FormControl>

                                <FormMessage />
                                <FormDescription
                                    className={isDeviceError ? "text-red-500" : ""}
                                >
                                    {isDeviceError
                                        ? deviceErrorMessage
                                        : (
                                            <>
                                                You can find this
                                                <span className="text-red-500"> Serial No. </span>
                                                on the back of your device.
                                            </>
                                        )}
                                </FormDescription>


                                {/* {deviceErrorMessage && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {deviceErrorMessage}
                                    </p>
                                )} */}
                            </FormItem>
                        )}
                    />

                    {/* DEVICE NAME */}
                    <FormField
                        name="deviceName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Device Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* MODEL NAME */}
                    <FormField
                        name="modelId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model Name</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled
                                    >
                                        <SelectTrigger
                                            className={`
                                                ${isDeviceFound ? "border-green-500 bg-green-50" : ""}
                                                ${isDeviceError ? "border-red-500 bg-red-50" : ""}
                                            `}
                                        >
                                            <SelectValue placeholder="Auto-detected model" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {modelsData?.map((model) => (
                                                <SelectItem key={model.id} value={model.id}>
                                                    {model.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* LAT */}
                    <FormField
                        name="lat"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* LONG */}
                    <FormField
                        name="long"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end pt-6">
                        <Button
                            type="submit"
                            disabled={isSubmitDisabled}
                        >
                            {registerMutation.isPending
                                ? "Saving..."
                                : isCheckingDevice
                                    ? "Checking..."
                                    : "Continue"}
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    )
}