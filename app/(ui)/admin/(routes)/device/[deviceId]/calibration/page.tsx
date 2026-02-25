"use client";

import * as z from "zod";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash2, Plus, Settings2, History, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

    const { data: logs, isLoading } = useQuery<CalibrationLog[]>({
        queryKey: ["calibrations", params.deviceId],
        queryFn: async () => {
            const { data } = await http.get(`/api/admin/device/${params.deviceId}/calibration`);
            return data;
        },
    });

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
        <div className="p-6 max-w-7xl mx-auto space-y-6">
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

               
                <Card className="lg:col-span-7">
                    <CardHeader><CardTitle className="flex items-center gap-2"><History size={20} /> Log History</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-25">Status</TableHead>
                                    <TableHead>Values</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Lifecycle</TableHead>
                                    <TableHead className="text-right">Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                   
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : Array.isArray(logs) && logs.length > 0 ? (
                                   
                                    logs.map((log: any) => (
                                        <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                                           
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "font-bold px-2.5 py-0.5 rounded-full border-none",                           
                                                        log.status === "PENDING" && "bg-amber-100 text-amber-700 hover:bg-amber-100/80",
                                                        log.status === "SUCCESS" && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80",
                                                        log.status === "EXPIRED" && "bg-rose-100 text-rose-700 hover:bg-rose-100/80",
                                                        log.status === "DELIVERED" && "bg-blue-100 text-blue-700 hover:bg-blue-100/80"
                                                    )}
                                                >
                                                    {log.status}
                                                </Badge>
                                            </TableCell>

                                        
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1 max-w-62.5">
                                                    {Object.entries(log.newValues || {}).map(([key, value]) => (
                                                        <Badge key={key} variant="outline" className="text-[10px] uppercase font-mono bg-white">
                                                            <span className="text-muted-foreground mr-1">{key}:</span>
                                                            {value as string}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>

                                            
                                            <TableCell className="max-w-37.5 truncate text-sm">
                                                <span title={log.reason}>{log.reason || "—"}</span>
                                            </TableCell>

                                           
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-[11px]">
                                                    <div className="flex items-center text-emerald-600">
                                                        <span className="w-12 font-semibold">From:</span>
                                                        {new Date(log.effectiveFrom).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center text-amber-600">
                                                        <span className="w-12 font-semibold">Exp:</span>
                                                        {new Date(log.expiresAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            
                                            <TableCell className="text-right text-xs text-muted-foreground">
                                                {new Date(log.createdAt).toLocaleString([], {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short'
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                            No logs available for this device.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}