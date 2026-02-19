"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    data: any[];
    metricKey: string; // example: avgAqi
    metricLabel: string;
};

export function ChartAreaInteractive({ data, metricKey, metricLabel }: Props) {
    const [timeRange, setTimeRange] = React.useState("7d");

    // avgAqi => minAqi, maxAqi
    const minKey = metricKey.replace("avg", "min");
    const maxKey = metricKey.replace("avg", "max");

    const chartData = (data ?? []).map((d) => ({
        date: d.dayStart,
        avg: d[metricKey] ?? null,
        min: d[minKey] ?? null,
        max: d[maxKey] ?? null,
    }));

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);

        const referenceDate =
            chartData.length > 0
                ? new Date(chartData[chartData.length - 1].date)
                : new Date();

        let daysToSubtract = 7;
        if (timeRange === "30d") daysToSubtract = 30;
        if (timeRange === "90d") daysToSubtract = 90;

        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        return date >= startDate;
    });

    const chartConfig = {
        avg: {
            label: `Avg ${metricLabel}`,
            color: "var(--chart-1)",
        },
        min: {
            label: `Min ${metricLabel}`,
            color: "var(--chart-2)",
        },
        max: {
            label: `Max ${metricLabel}`,
            color: "var(--chart-3)",
        },
    } satisfies ChartConfig;

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>{metricLabel} Trends</CardTitle>
                    <CardDescription>
                        Showing Avg / Min / Max values ({timeRange})
                    </CardDescription>
                </div>

                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select time range"
                    >
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl">
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="90d" className="rounded-lg">
                            Last 90 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-62.5 w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillAvg" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-avg)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-avg)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>

                            <linearGradient id="fillMin" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-min)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-min)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>

                            <linearGradient id="fillMax" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-max)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-max)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={0}
                            padding={{ left: 20, right: 20 }} 
                            tick={{ fontSize: 11 }}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />



                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                    indicator="dot"
                                />
                            }
                        />


                        {/* MAX */}
                        <Area
                            dataKey="max"
                            type="natural"
                            fill="url(#fillMax)"
                            stroke="var(--color-max)"
                        />

                        {/* AVG */}
                        <Area
                            dataKey="avg"
                            type="natural"
                            fill="url(#fillAvg)"
                            stroke="var(--color-avg)"
                        />


                        {/* MIN */}
                        <Area
                            dataKey="min"
                            type="natural"
                            fill="url(#fillMin)"
                            stroke="var(--color-min)"
                        />

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
