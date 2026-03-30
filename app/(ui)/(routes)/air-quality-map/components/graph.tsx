"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { Loader2 } from "lucide-react";

// Define the shape of the history data from your API
interface GraphProps {
    data?: Array<{
        measuredAt: string;
        aqi: number;
    }>;
    isLoading?: boolean;
}

const chartConfig = {
    aqi: {
        label: "AQI",
        color: "#06b6d4",
    },
} satisfies ChartConfig;

export function Graph({ data = [], isLoading }: GraphProps) {

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-zinc-50/50 rounded-2xl">
                <Loader2 className="w-6 h-6 text-zinc-300 animate-spin" />
            </div>
        );
    }


    if (!data) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-zinc-50/50 rounded-2xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No History Data</span>
            </div>
        );
    }

    const formattedData = [...data]
        .sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime())
        .map((item) => ({
            // Format date to show Day or Time (e.g., "Mon" or "12 PM")
            date: new Date(item.measuredAt).toLocaleDateString([], { weekday: 'short' }),
            fullDate: new Date(item.measuredAt).toLocaleString(),
            aqi: item.aqi,
        }));

    return (
        <div className="w-full h-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={formattedData}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 10,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillAqi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-aqi)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-aqi)" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            verticalFill={['#f8fafc', '#ffffff']}
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={9}
                            fontWeight={700}
                            stroke="#94a3b8"
                            // If you have many data points, show every 2nd or 3rd tick
                            interval="preserveStartEnd"
                        />

                        <YAxis
                            hide
                            domain={['dataMin - 10', 'dataMax + 10']}
                        />

                        <ChartTooltip
                            cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '4 4' }}
                            content={
                                <ChartTooltipContent
                                    className="rounded-xl border-none shadow-xl bg-white/90 backdrop-blur-md"
                                    // This function formats the header of the tooltip
                                    labelFormatter={(value, payload) => {
                                        return `Date: ${payload[0]?.payload?.fullDate.split(',')[0] || value}`;
                                    }}
                                />
                            }
                        />

                        <Area
                            dataKey="aqi"
                            type="monotone"
                            fill="url(#fillAqi)"
                            fillOpacity={1}
                            stroke="var(--color-aqi)"
                            strokeWidth={3}
                            dot={false}
                            animationDuration={1500}
                            activeDot={{ r: 5, strokeWidth: 0, fill: '#06b6d4' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}