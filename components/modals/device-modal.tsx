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
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card"
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
    const latValue = watch("lat")
    const longValue = watch("long")

    /* ===============================
       DEVICE LOOKUP HOOK
    =============================== */

    const {
        isFetching: isCheckingDevice,
        isFound: isDeviceFound,
        isError: isDeviceError,
        errorMessage: deviceErrorMessage,
    } = useDeviceLookup(serialNo, setValue)

    const handleGetLocation = () => {
        if (!("geolocation" in navigator)) {
            toast.error("Geolocation is not supported by your browser.")
            return
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toString()
                const lng = pos.coords.longitude.toString()

                setValue("lat", lat)
                setValue("long", lng)

                toast.success("Location detected successfully 📍")
            },
            (err) => {
                toast.error(err.message || "Failed to get location")
            }
        )
    }

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

                    {/* LOCATION SECTION */}
                    <div className="space-y-2">
                        <FormLabel>Device Location</FormLabel>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* LAT */}
                            <FormField
                                name="lat"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="md:col-span-1">
                                        <FormControl>
                                            <Input {...field} placeholder="Latitude" disabled />
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
                                    <FormItem className="md:col-span-1">
                                        <FormControl>
                                            <Input {...field} placeholder="Longitude" disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* BUTTON */}
                            <div className="flex items-end md:col-span-1">
                                <HoverCard openDelay={200}>
                                    <HoverCardTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleGetLocation}
                                            className="w-full cursor-pointer"
                                        >
                                            📍 Auto Detect
                                        </Button>
                                    </HoverCardTrigger>

                                    <HoverCardContent
                                        align="center"
                                        className="w-64 text-sm"
                                    >
                                        Automatically detect
                                        <span className="text-red-600 px-2">
                                            your current GPS location
                                        </span>
                                        and fill in the latitude and longitude fields.
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </div>
                    </div>

                    {/* GOOGLE MAP PREVIEW */}
                    {latValue && longValue && (
                        <div className="mt-4 rounded-lg overflow-hidden border hidden md:block">
                            <iframe
                                title="Google Map Preview"
                                width="100%"
                                height="250"
                                loading="lazy"
                                className="w-full"
                                src={`https://www.google.com/maps?q=${latValue},${longValue}&z=15&output=embed`}
                            />
                        </div>
                    )}

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


