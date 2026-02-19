"use client"
import { useState } from "react";
import { Cell } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { aqiColorPallet, getAQIColor, getAQITheme } from "@/helpers/aqi-color-pallet";
import ChartLoader from "@/components/ui/chart-loading";

export function MonthlyInsights() {
    const deviceId = "698db75ef96c5dfba830ca22";

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth(); // 0-11

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);



    const monthNumber = months.indexOf(selectedMonth) + 1;

    const { data, isPending, error } = useQuery({
        queryKey: ["monthlyInsights", deviceId, currentYear, monthNumber],
        queryFn: async () => {
            const res = await http.get(
                `/api/user/dashboard/monthly?deviceId=${deviceId}&year=${currentYear}&month=${monthNumber}`
            );
            return res.data;
        },
    });


    const chartData: { day: string; aqi: number; fullDate: string }[] =
        data?.data?.map((item: any) => {
            const d = new Date(item.dayStart);

            const day = d.getUTCDate();
            const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });

            return {
                day: String(day),
                aqi: item.avgAqi,
                fullDate: `${day} ${month}`
            };
        }) || [];


    const aqiCategories = aqiColorPallet.map((pallet) => {
        const daysCount = chartData.filter(
            (d) => d.aqi >= pallet.range[0] && d.aqi <= pallet.range[1]
        ).length;

        return {
            label: pallet.label,
            color: pallet.backgroundColor,
            days: `${daysCount} Day${daysCount > 1 ? "s" : ""}`,
        };
    });

    const avgMonthAqi =
        chartData.length > 0
            ? Math.round(chartData.reduce((sum, item) => sum + item.aqi, 0) / chartData.length)
            : 0;

    const minEntry =
        chartData.length > 0
            ? chartData.reduce((min, curr) => (curr.aqi < min.aqi ? curr : min))
            : null;

    const maxEntry =
        chartData.length > 0
            ? chartData.reduce((max, curr) => (curr.aqi > max.aqi ? curr : max))
            : null;



    const chartConfig = {
        aqi: {
            label: "AQI",
            color: "#2563eb",
        }
    } satisfies ChartConfig


    return (
        <Card
            className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up"
            style={{ animationDelay: "500ms" }}
        >
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row justify-between ">
                <h2 className="text-xl font-semibold text-foreground mt-1">Monthly Insights</h2>
                <div className="flex items-center gap-2">
                    <Select
                        value={selectedMonth}
                        onValueChange={(value) => setSelectedMonth(value)}
                        disabled={isPending}
                    >
                        <SelectTrigger className="w-35">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>

                        <SelectContent>
                            {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>
            </div>
            <div className="w-full bg-background p-4 md:p-6 lg:p-8">
                <div className="space-y-6">

                    {/* Average Section */}
                    <div className="flex flex-col justify-center bg-slate-50 rounded-lg p-4 md:p-6 lg:flex-1">
                        <p className="text-sm text-slate-600 mb-2">{selectedMonth} Avg.</p>

                        {isPending ? (
                            <p className="text-4xl md:text-5xl font-bold text-slate-400">--</p>
                        ) : chartData.length === 0 ? (
                            <p className="text-2xl font-semibold text-slate-500">No Data</p>
                        ) : (
                            <p className="text-4xl md:text-5xl font-bold text-red-600">
                                {avgMonthAqi}
                            </p>
                        )}
                    </div>


                    {/* Progress and Date Section */}
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
                        <ChartContainer config={chartConfig} className="min-h-50 w-full">
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                                <ChartTooltip content={<CustomTooltip />} />

                                <Bar dataKey="aqi" radius={4}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={getAQIColor(entry.aqi)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    )}




                </div>

                {/* Categories Section */}
                <div className="space-y-4">
                    <p className="text-sm md:text-base font-medium text-slate-700">
                        In the day of <span className="font-semibold">{selectedMonth} 2026</span>:
                    </p>

                    {/* Grid Layout - Responsive */}
                    <div className="grid grid-cols-2 md:grid-col-3 gap-3 ">
                        {aqiCategories.map((category, index) => (
                            <div key={index} className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 md:p-4">
                                <div className={`w-4 h-4 rounded ${category.color}`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs md:text-sm font-medium text-slate-800 truncate">{category.label}</p>
                                    <p className="text-xs text-slate-500">{category.days}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Min/Max Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                    {/* Min Card */}
                    <div className="bg-slate-50 rounded-lg p-4 md:p-6 space-y-3">
                        <p className="text-sm text-slate-600 font-medium">Min.</p>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                {minEntry ? `On ${minEntry.day} ${selectedMonth}` : "No Data"}
                            </p>

                            <div className="bg-red-600 text-white font-bold rounded px-4 py-2">
                                {minEntry ? minEntry.aqi : "--"}
                            </div>
                        </div>
                    </div>

                    {/* Max Card */}
                    <div className="bg-slate-50 rounded-lg p-4 md:p-6 space-y-3">
                        <p className="text-sm text-slate-600 font-medium">Max.</p>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                {maxEntry ? `On ${maxEntry.day} ${selectedMonth}` : "No Data"}
                            </p>

                            <div className="bg-red-600 text-white font-bold rounded px-4 py-2">
                                {maxEntry ? maxEntry.aqi : "--"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Card>
    )
}



const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const { fullDate, aqi } = payload[0].payload;
    const theme = getAQITheme(aqi);

    return (
        <div className={`rounded-lg border p-3 shadow-md bg-white dark:bg-black ${theme.borderClass}`}>
            <p className="text-xs text-slate-500">{fullDate}</p>
            <p className={`text-sm font-semibold ${theme.text}`}>
                AQI: {aqi} ({theme.label})
            </p>
        </div>
    );
};

