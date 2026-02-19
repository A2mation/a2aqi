"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

import { http } from "@/lib/http";
import { getAQIColor } from "@/helpers/aqi-color-pallet";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { AVG_METRIC_OPTIONS, AvgMetricKey, MaxMetricKey, MinMetricKey } from "@/constant/metrics";
import ChartLoader from "@/components/ui/chart-loading";


type WeeklyChartData = {
    day: string;
    value: number;
    maxValue: number;
    minValue: number;
    label: string;
    fullDate: string;
    weekdayIndex: number;
};

const weekOrder = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function WeeklyAqiAnalytics() {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    const [selectedAvgMetric, setSelectedAvgMetric] = useState<AvgMetricKey>("avgAqi");
    const [selectedMinMetric, setSelectedMinMetric] = useState<MinMetricKey>("minAqi");
    const [selectedMaxMetric, setSelectedMaxMetric] = useState<MaxMetricKey>("maxAqi");

    const deviceId = "698db75ef96c5dfba830ca22";
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const { data, isPending, error } = useQuery({
        queryKey: ["weeklyAnalytics", deviceId, date],
        queryFn: async () => {
            const res = await http.get(
                `/api/user/dashboard/weekly?deviceId=${deviceId}&date=${date}`
            );
            return res.data;
        },
    });

    const chartData: WeeklyChartData[] =
        data?.data
            ?.map((item: any) => {
                const d = new Date(item.dayStart);

                const weekdayIndex = d.getUTCDay();
                const dayShort = weekOrder[weekdayIndex];

                const dayName = d.toLocaleString("en-US", {
                    weekday: "long",
                    timeZone: "UTC",
                });

                const baseMetric = selectedAvgMetric.replace("avg", "");

                const avgValue = item[`avg${baseMetric}`];
                const minValue = item[`min${baseMetric}`];
                const maxValue = item[`max${baseMetric}`];

                if (avgValue === null || avgValue === undefined) return null;

                return {
                    day: dayShort,
                    value: avgValue,
                    minValue: minValue ?? 0,
                    maxValue: maxValue ?? 0,
                    label: dayName,
                    fullDate: d.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                    }),
                    weekdayIndex,
                };
            })
            .filter(Boolean)
            .sort(
                (a: WeeklyChartData, b: WeeklyChartData) =>
                    a.weekdayIndex - b.weekdayIndex
            ) || [];


    const maxValue =
        chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 0;

    const average =
        chartData.length > 0
            ? Math.round(
                chartData.reduce((acc, d) => acc + d.value, 0) / chartData.length
            )
            : 0;

    const metricLabel =
        AVG_METRIC_OPTIONS.find((m) => m.key === selectedAvgMetric)?.label ?? "AQI";

    const availableMetrics = AVG_METRIC_OPTIONS.filter((metric) =>
        data?.data?.some((row: any) => row[metric.key] !== null && row[metric.key] !== undefined)
    );


    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) return null;

        const point = payload[0].payload;

        // payload contains 3 items: avg, min, max
        // find which one has the hovered value
        const hovered = payload.find((p: any) => p.value !== undefined);

        if (!hovered) return null;

        let title = "Avg";

        if (hovered.name === "minValue") title = "Min";
        if (hovered.name === "maxValue") title = "Max";
        if (hovered.name === "value") title = "Avg";

        return (
            <div className="bg-foreground text-background px-3 py-2 rounded-lg text-xs font-semibold shadow-lg min-w-40">
                <p className="text-[10px] opacity-80">{point.label}</p>
                <p className="text-[10px] opacity-80">{point.fullDate}</p>

                <div className="mt-2">
                    <p className="font-bold">
                        {title}: {hovered.value} {metricLabel}
                    </p>
                </div>
            </div>
        );
    };





    return (
        <Card
            className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up bg-linear-to-br from-background to-muted/20"
            style={{ animationDelay: "400ms" }}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4 flex-row items-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="relative flex size-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex size-3 rounded-full bg-red-600"></span>
                        </span>
                    </div>

                    <h2 className="text-xl font-semibold text-foreground">
                        Weekly Analysis
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    {/* Metric Select */}
                    <Select
                        value={selectedAvgMetric}
                        onValueChange={(val) => {
                            const avgKey = val as AvgMetricKey;
                            const baseMetric = avgKey.replace("avg", "");

                            setSelectedAvgMetric(avgKey);
                            setSelectedMinMetric(`min${baseMetric}` as MinMetricKey);
                            setSelectedMaxMetric(`max${baseMetric}` as MaxMetricKey);
                        }}

                    >
                        <SelectTrigger className="w-37.5 h-9">
                            <SelectValue placeholder="Select Metric" />
                        </SelectTrigger>

                        <SelectContent>
                            {availableMetrics.map((m) => (
                                <SelectItem key={m.key} value={m.key}>
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>



                </div>
            </div>

            <div className="h-64 mb-4 relative">
                {isPending ? (
                    <div className="min-h-50 w-full">
                        <ChartLoader />
                    </div>
                ) : error ? (
                    <div className="min-h-50 w-full flex items-center justify-center">
                        <p className="text-sm text-red-500">Failed to load chart data</p>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="min-h-50 w-full flex items-center justify-center">
                        <p className="text-sm text-slate-500">No data found</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="currentColor"
                                className="text-muted/20"
                            />

                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "currentColor", fontSize: 14 }}
                                className="text-muted-foreground"
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "currentColor", fontSize: 12 }}
                                className="text-muted-foreground"
                            />

                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} shared={false} />

                            {/* ✅ MIN Bar */}
                            <Bar dataKey="minValue" radius={[12, 12, 12, 12]} maxBarSize={60}>
                                {chartData.map((_, index) => (
                                    <Cell key={`min-${index}`} fill="#93c5fd" />
                                ))}
                            </Bar>

                            {/* ✅ AVG Bar */}
                            <Bar dataKey="value" radius={[12, 12, 12, 12]} maxBarSize={60}>
                                {chartData.map((_, index) => (
                                    <Cell key={`avg-${index}`} fill="#3b82f6" />
                                ))}
                            </Bar>

                            {/* ✅ MAX Bar */}
                            <Bar dataKey="maxValue" radius={[12, 12, 12, 12]} maxBarSize={60}>
                                {chartData.map((_, index) => (
                                    <Cell key={`max-${index}`} fill="#1d4ed8" />
                                ))}
                            </Bar>

                        </BarChart>

                    </ResponsiveContainer>
                )}
            </div>

            {/* Summary stats */}
            <div className="pt-4 border-t border-muted/50 flex items-center justify-between">
                <div className="text-sm">
                    <span className=" text-blue-400">Average: </span>
                    <span className="font-semibold text-muted-foreground">
                        {average} {metricLabel}
                    </span>
                </div>

                <div className="text-sm">
                    <span className=" text-red-600">Peak: </span>
                    <span className="font-semibold text-primary">
                        {maxValue} {metricLabel}
                    </span>
                </div>
            </div>
        </Card>
    );
}


