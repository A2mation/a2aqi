"use client"

import * as React from "react"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import toast from "react-hot-toast"
import { CalendarIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"

import { cn } from "@/lib/utils"
import { useExportDrawerStore } from "@/store/use-export-drawer-store"
import { http } from "@/lib/http"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { MAX_DAILY_DAYS, MAX_HOURLY_DAYS } from "@/constant/Export-Metrices"


const exportSchema = z
    .object({
        deviceId: z.string().min(1, "Device is required"),
        type: z.enum(["hourly", "daily"]),
        dateRange: z.object({
            from: z.date(),
            to: z.date(),
        }),
    })
    .superRefine((data, ctx) => {
        const { from, to } = data.dateRange

        if (from > to) {
            ctx.addIssue({
                code: "custom",
                message: "Start date must be before end date",
                path: ["dateRange"],
            })
            return
        }

        const diffDays =
            (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)

        if (data.type === "hourly" && diffDays > MAX_HOURLY_DAYS) {
            ctx.addIssue({
                code: "custom",
                message: `Hourly export cannot exceed ${MAX_HOURLY_DAYS} days`,
                path: ["dateRange"],
            })
        }

        if (data.type === "daily" && diffDays > MAX_DAILY_DAYS) {
            ctx.addIssue({
                code: "custom",
                message: `Daily export cannot exceed ${MAX_DAILY_DAYS} days`,
                path: ["dateRange"],
            })
        }
    })

type ExportFormValues = z.infer<typeof exportSchema>



export function ExportDrawer({
    devices,
}: {
    devices: { id: string; name: string | null }[]
}) {
    const { isOpen, closeDrawer, deviceId, type, dateRange } =
        useExportDrawerStore()

    const form = useForm<ExportFormValues>({
        resolver: zodResolver(exportSchema),
        mode: "onChange",
        defaultValues: {
            type: type ?? "hourly",
            deviceId: deviceId ?? undefined,
            dateRange:
                dateRange?.from && dateRange?.to
                    ? {
                        from: dateRange.from,
                        to: dateRange.to,
                    }
                    : undefined,
        },
    })

    const values = form.watch();
    const isDaily = values.type === "daily";


    const applyPreset = (days: number) => {
        const to = endOfDay(new Date())
        const from = startOfDay(subDays(new Date(), days))

        form.setValue(
            "dateRange",
            { from, to },
            { shouldValidate: true }
        )
    }

    const previewQuery = useQuery({
        queryKey: [
            "export-preview",
            values.deviceId,
            values.type,
            values.dateRange?.from?.toISOString(),
            values.dateRange?.to?.toISOString(),
        ],
        queryFn: async () => {
            if (
                !values.deviceId ||
                !values.dateRange?.from ||
                !values.dateRange?.to
            ) {
                return null
            }

            const params = new URLSearchParams({
                deviceId: values.deviceId,
                startDate: values.dateRange.from.toISOString(),
                endDate: values.dateRange.to.toISOString(),
                type: values.type,
            })

            const res = await http.get(`/api/user/export/preview?${params}`)
            if (!res.data) return null
            return res.data;
        },
        enabled:
            !!values.deviceId &&
            !!values.dateRange?.from &&
            !!values.dateRange?.to,
    })


    async function onSubmit(data: ExportFormValues) {
        const params = new URLSearchParams({
            deviceId: data.deviceId,
            startDate: data.dateRange.from.toISOString(),
            endDate: data.dateRange.to.toISOString(),
            type: data.type,
        })

        const res = await http.get(`/api/user/export?${params}`, {
            responseType: "blob",
        })

        const contentDisposition = res.headers["content-disposition"]
        let fileName = `a2aqi-${data.type}-report.csv`

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+)"?/)
            if (match?.[1]) {
                fileName = match[1]
            }
        }

        const url = window.URL.createObjectURL(res.data)

        const link = document.createElement("a")
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()

        link.remove()
        window.URL.revokeObjectURL(url)

        closeDrawer()
    }





    return (
        <Drawer
            open={isOpen}
            onOpenChange={closeDrawer}
            direction="right"
        >
            <DrawerContent
                className="fixed inset-y-0 right-0 h-full w-full sm:max-w-md border-l bg-background"
            >
                <DrawerHeader>
                    <DrawerTitle className="text-xl font-bold text-primary">Export Data</DrawerTitle>
                    <DrawerDescription>
                        Download historical sensor data as CSV
                    </DrawerDescription>
                </DrawerHeader>

                <Separator />

                <div className="px-4 pb-6 my-10">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Device */}
                            <FormField
                                control={form.control}
                                name="deviceId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Device</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select device" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {devices.map((device) => (
                                                    <SelectItem key={device.id} value={device.id}>
                                                        {device.name ?? "Unnamed Device"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date Range */}
                            <FormField
                                control={form.control}
                                name="dateRange"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col space-y-3">
                                        <FormLabel>Date Range</FormLabel>

                                        <div className="flex gap-2 flex-wrap">

                                            <>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => applyPreset(7)}
                                                    className=" cursor-pointer"
                                                >
                                                    7D
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => applyPreset(30)}
                                                    className=" cursor-pointer"
                                                >
                                                    30D
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => applyPreset(90)}
                                                    className=" cursor-pointer"
                                                >
                                                    90D
                                                </Button>
                                            </>
                                            {isDaily &&
                                                <>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => applyPreset(180)}
                                                        className=" cursor-pointer"
                                                    >
                                                        6M
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => applyPreset(365)}
                                                        className=" cursor-pointer"
                                                    >
                                                        1Y
                                                    </Button>
                                                </>
                                            }
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            {values.type === "hourly"
                                                ? "Max 90 days for hourly export"
                                                : "Max 365 days for daily export"}
                                        </p>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "justify-start text-left font-normal",
                                                            !field.value &&
                                                            "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value?.from &&
                                                            field.value?.to
                                                            ? `${format(
                                                                field.value.from,
                                                                "dd MMM yyyy"
                                                            )} - ${format(
                                                                field.value.to,
                                                                "dd MMM yyyy"
                                                            )}`
                                                            : "Pick a date range"}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>

                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="range"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    numberOfMonths={2}
                                                    disabled={(date) =>
                                                        date > new Date()
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Aggregation */}
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Aggregation</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="flex gap-6"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="hourly"
                                                        id="hourly"
                                                    />
                                                    <Label htmlFor="hourly">
                                                        Hourly
                                                    </Label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="daily"
                                                        id="daily"
                                                    />
                                                    <Label htmlFor="daily">
                                                        Daily
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Preview */}
                            {previewQuery.data && (
                                <div className="rounded-md bg-muted p-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Rows</span>
                                        <span>{previewQuery.data.count}</span>
                                    </div>
                                </div>
                            )}

                            <DrawerFooter className="px-0">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={closeDrawer}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={
                                        !form.formState.isValid ||
                                        previewQuery.isLoading
                                    }
                                >
                                    {previewQuery.isLoading
                                        ? "Calculating..."
                                        : "Export CSV"}
                                </Button>
                            </DrawerFooter>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}