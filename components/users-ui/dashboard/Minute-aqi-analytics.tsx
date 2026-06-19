"use client";

import {
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useParams } from "next/navigation";
import { SensorReading } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { ChartArea, ChartNetwork, ChevronDown, Filter } from "lucide-react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { http } from "@/lib/http";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ChartLoader from "@/components/ui/chart-loading";
import { PARAM_MASTER_CONFIG } from "@/constant/metrics";
import { useDeviceStore } from "@/store/use-device.store";



export function MinuteAqiAnalytics() {
    const { deviceId } = useParams();

    const setSelectedDeviceActiveStatus = useDeviceStore((state) => state.setSelectedDeviceActiveStatus);

    const [chartType, setChartType] = useState < "line" | "Area" > ("Area");
    const [selectedMetricKeys, setSelectedMetricKeys] = useState < string[] > (["aqi"]);

    const { data, isPending, error, refetch } = useQuery < SensorReading[] > ({
        queryKey: ["user-minuteAnalytics", deviceId],
        queryFn: async () => {
            const res = await http.get(`/api/user/dashboard/minute?deviceId=${deviceId}`);
            if (res.status === 200) {
                return res.data;
            }
            throw new Error(res.data.error || 'Something went Wrong');
        },
        staleTime: 1000 * 60,
        refetchInterval: 1000 * 60,
        placeholderData: (previousData) => previousData,
    });

    useEffect(() => {
        if (data && data[0]?.createdAt) {
            const lastUpdate = data[0].createdAt;
            const now = Date.now();
            const TWO_MINUTES_IN_MS = 2 * 60 * 1000;

            const isActive = (now - new Date(lastUpdate).getTime()) < TWO_MINUTES_IN_MS;

            setSelectedDeviceActiveStatus(isActive);
        }
    }, [data, setSelectedDeviceActiveStatus]);

    const availableMetrics = useMemo(() => {
        if (!data || data.length === 0) return [];
        return PARAM_MASTER_CONFIG.filter(metric => {
            const dataKey = metric.id.toLowerCase();
            return data.some((row: any) => row[dataKey] !== null && row[dataKey] !== undefined);
        });
    }, [data]);

    const toggleMetric = (key: string) => {
        const lowerKey = key.toLowerCase();
        setSelectedMetricKeys((prev) => {
            if (prev.includes(lowerKey)) {
                return prev.length > 1 ? prev.filter((k) => k !== lowerKey) : prev;
            }
            return [...prev, lowerKey];
        });
    };

    const chartData = useMemo(() => {
        if (!data) return [];
        return [...data]
            .map((item: any) => ({
                ...item,
                fullTime: new Date(item.measuredAt).toLocaleTimeString([], { hour12: false }),
                time: new Date(item.measuredAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
            }))
            .reverse();
    }, [data]);


    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/20 text-white px-4 py-3 rounded-xl text-xs font-medium shadow-2xl min-w-45">
                    <p className="text-[10px] text-slate-300 opacity-80 mb-2 border-b border-white/10 pb-1.5 flex justify-between">
                        <span>Time:</span>
                        <span>{payload[0].payload.fullTime}</span>
                    </p>
                    <div className="space-y-2">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex justify-between items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-slate-200">{entry.name}:</span>
                                </div>
                                <span className="font-bold text-white tabular-nums">
                                    {entry.value.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="p-6 transition-all duration-500 hover:shadow-xl bg-linear-to-br from-background to-muted/20">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-2">
                <div className="flex items-center gap-4">
                    <div className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-red-600"></span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold text-foreground">
                            Hourly Parameter Stream
                        </h2>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                            Last 60 Minutes of Granular Data
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={chartType} onValueChange={(val: "line" | "Area") => setChartType(val)}>
                        <SelectTrigger className="w-36 h-9 bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="flex items-center gap-2">
                            <SelectItem value="Area"><ChartArea className="size-4" /> Area View</SelectItem>
                            <SelectItem value="line"><ChartNetwork className="size-4" />  Line View</SelectItem>
                        </SelectContent>
                    </Select>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2 bg-background">
                                <Filter className="size-4" />
                                {selectedMetricKeys.length} Params
                                <ChevronDown className="size-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 max-h-100 overflow-y-auto">
                            <DropdownMenuLabel>Visible Parameters</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {availableMetrics.map((m) => {
                                const key = m.id.toLowerCase();
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={m.id}
                                        checked={selectedMetricKeys.includes(key)}
                                        onCheckedChange={() => toggleMetric(key)}
                                        disabled={selectedMetricKeys.length === 1 && selectedMetricKeys.includes(key)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="size-4 rounded-full" style={{ backgroundColor: m.color }} />
                                            {m.label}
                                        </div>
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="h-80 px-0">
                {isPending ? (
                    <ChartLoader />
                ) : error ? (
                    <div className="h-full w-full flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 size-16 bg-destructive/20 rounded-full blur-xl animate-pulse" />
                            <div className="relative size-12 rounded-full border-2 border-destructive/50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-6 text-destructive"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-center space-y-1">
                            <h3 className="text-sm font-semibold text-foreground">Data Stream Interrupted</h3>
                            <p className="text-xs text-muted-foreground max-w-50">
                                We're having trouble connecting to the sensor right now.
                            </p>
                        </div>

                        {/* Premium Refetch Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="h-8 px-4 rounded-full border-muted/50 bg-background/50 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 active:scale-95"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "Area" ? (
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    {selectedMetricKeys.map((key) => {
                                        const config = PARAM_MASTER_CONFIG.find(c => c.id.toLowerCase() === key);
                                        return (
                                            <linearGradient key={`grad-${key}`} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={config?.color || '#3b82f6'} stopOpacity={0.4} />
                                                <stop offset="95%" stopColor={config?.color || '#3b82f6'} stopOpacity={0} />
                                            </linearGradient>
                                        );
                                    })}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/20" />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                                    minTickGap={50}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                {selectedMetricKeys.map((key) => {
                                    const config = PARAM_MASTER_CONFIG.find(c => c.id.toLowerCase() === key);
                                    return (
                                        <Area
                                            key={key}
                                            type="monotone"
                                            dataKey={key}
                                            name={config?.label || key}
                                            stroke={config?.color}
                                            strokeWidth={2.5}
                                            fill={`url(#color-${key})`}
                                            animationDuration={1000}
                                        />
                                    );
                                })}
                            </AreaChart>
                        ) : (
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/20" />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                                    minTickGap={50}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                {selectedMetricKeys.map((key) => {
                                    const config = PARAM_MASTER_CONFIG.find(c => c.id.toLowerCase() === key);
                                    return (
                                        <Line
                                            key={key}
                                            type="monotone"
                                            dataKey={key}
                                            name={config?.label || key}
                                            stroke={config?.color}
                                            strokeWidth={3}
                                            dot={{ r: 3.5, fill: config?.color, strokeWidth: 0 }}
                                            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                            animationDuration={1000}
                                        />
                                    );
                                })}
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                )}
            </CardContent>

            {!isPending && <CardFooter className="border-t border-muted/50 flex flex-wrap gap-x-8 gap-y-3">
                {selectedMetricKeys.map((key) => {
                    const config = PARAM_MASTER_CONFIG.find(c => c.id.toLowerCase() === key);
                    const values = chartData.map(d => d[key]).filter(v => typeof v === 'number');
                    const avg = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : "0";

                    return (
                        <div key={key} className="flex items-center gap-2.5">
                            <div
                                className={`size-3 rounded-full ${config?.shadow} shadow-md`}
                                style={{ backgroundColor: config?.color }}
                            />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                    {config?.label}
                                </span>
                                <span className="text-sm font-bold text-foreground">
                                    Avg {avg}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </CardFooter>}
        </Card>
    );
}