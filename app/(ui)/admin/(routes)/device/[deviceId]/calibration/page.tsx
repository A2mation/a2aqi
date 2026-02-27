"use client";

import * as z from "zod";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash2, Plus, Settings2, History, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { Input } from "@/components/ui/input";
import { CalibrationLog } from "@/types/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SENSOR_OPTIONS } from "@/constant/metrics";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";



interface SensorField {
    key: string;
    value: number;
}

interface CalibrationFormValues {
    reason: string;
    sensors: SensorField[];
}

const calibrationSchema = z.object({
    reason: z.string().min(2, "Reason is required"),
    sensors: z.array(
        z.object({
            key: z.string().min(1, "Select a sensor"),
            value: z.coerce.number(
                "Must be a number"
            ),
        })
    ).min(1, "Add at least one calibration value"),
});

export default function DynamicCalibrationPage() {
    const params = useParams();
    const queryClient = useQueryClient();
    const { ref, inView } = useInView();

    const form = useForm<CalibrationFormValues>({

        resolver: zodResolver(calibrationSchema) as any,
        defaultValues: {
            reason: "",
            sensors: [{ key: "", value: 0 }]
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "sensors",
    });

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["calibrations-infinite", params.deviceId],
        queryFn: async ({ pageParam = null }) => {
            const { data } = await http.get(
                `/api/admin/device/${params.deviceId}/calibration`,
                { params: { cursor: pageParam, limit: 10 } }
            );
            return data; // { items: CalibrationLog[], nextCursor: string | null }
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allLogs = data?.pages.flatMap((page) => page.items) || [];

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof calibrationSchema>) => {
            const newValues = values.sensors.reduce((acc, curr) => ({
                ...acc,
                [curr.key]: curr.value
            }), {});

            const { data } = await http.post(`/api/admin/device/${params.deviceId}/calibration`, {
                newValues,
                reason: values.reason,
            });

            return data;
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["calibrations", params.deviceId] });

            form.reset({
                reason: "",
                sensors: [{ key: "", value: 0 }]
            });

            toast.success("Calibration Updated Successfully.");
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data || "Something went wrong";
            console.error("Calibration failed:", errorMessage);
            toast.error(errorMessage);
        }
    });

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


                <Card className="lg:col-span-5 h-fit">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Settings2 size={20} /> Configure Device</CardTitle></CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="reason"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reason</FormLabel>
                                            <Input {...field} placeholder="e.g. Sensor Drift Correction" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-3">
                                    <FormLabel>Sensor Values</FormLabel>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-start">
                                            <FormField
                                                control={form.control}
                                                name={`sensors.${index}.key`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Sensor" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {SENSOR_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt.toUpperCase()}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`sensors.${index}.value`}
                                                render={({ field }) => (
                                                    <FormItem className="w-24">
                                                        <Input
                                                            type="number"
                                                            {...form.register(`sensors.${index}.value` as const, { valueAsNumber: true })}
                                                        />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button variant="ghost" size="icon" onClick={() => remove(index)} type="button">
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" className="w-full mt-2" onClick={() => append({ key: "", value: 0 })}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Sensor
                                    </Button>
                                </div>

                                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                    {mutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Apply Calibration"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>


                <Card className="lg:col-span-7 flex flex-col h-150">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History size={20} /> Log History
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full px-6">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                                    <TableRow>
                                        <TableHead className="w-25">Status</TableHead>
                                        <TableHead>Values</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Lifecycle</TableHead>
                                        <TableHead className="text-right">Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allLogs.map((log: any) => (
                                        <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                                            {/* ... (Keep your existing TableCell content) */}
                                        </TableRow>
                                    ))}

                                    {/* INFINITE SCROLL TARGET */}
                                    <TableRow ref={ref} className="border-none">
                                        <TableCell colSpan={5} className="text-center py-4">
                                            {isFetchingNextPage ? (
                                                <div className="flex justify-center items-center gap-2 text-muted-foreground text-sm">
                                                    <Loader2 className="animate-spin w-4 h-4" />
                                                    Loading more...
                                                </div>
                                            ) : hasNextPage ? (
                                                <div className="h-4 w-4 bg-slate-200 rounded-full animate-bounce mx-auto" />
                                            ) : allLogs.length > 0 ? (
                                                <span className="text-xs text-muted-foreground italic">End of history</span>
                                            ) : null}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            {/* Initial Loading State */}
                            {isLoading && (
                                <div className="space-y-2 p-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            )}

                            {!isLoading && allLogs.length === 0 && (
                                <div className="h-32 flex items-center justify-center text-muted-foreground italic">
                                    No logs available for this device.
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}