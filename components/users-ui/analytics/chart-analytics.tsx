"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const description = "Air Quality interactive area chart"

const chartData = [
    { date: "2024-04-02", aqi: 112, pm10: 78, pm25: 52 },
    { date: "2024-04-03", aqi: 118, pm10: 82, pm25: 55 },
    { date: "2024-04-04", aqi: 125, pm10: 88, pm25: 60 },
    { date: "2024-04-05", aqi: 130, pm10: 92, pm25: 62 },
    { date: "2024-04-06", aqi: 140, pm10: 98, pm25: 66 },
    { date: "2024-04-07", aqi: 135, pm10: 95, pm25: 64 },
    { date: "2024-04-08", aqi: 128, pm10: 90, pm25: 59 },
    { date: "2024-04-09", aqi: 120, pm10: 85, pm25: 56 },
    { date: "2024-04-10", aqi: 115, pm10: 80, pm25: 53 },
    { date: "2024-04-11", aqi: 110, pm10: 76, pm25: 50 },

    { date: "2024-04-12", aqi: 105, pm10: 72, pm25: 48 },
    { date: "2024-04-13", aqi: 108, pm10: 74, pm25: 49 },
    { date: "2024-04-14", aqi: 115, pm10: 79, pm25: 52 },
    { date: "2024-04-15", aqi: 122, pm10: 84, pm25: 55 },
    { date: "2024-04-16", aqi: 135, pm10: 93, pm25: 61 },
    { date: "2024-04-17", aqi: 145, pm10: 101, pm25: 68 },
    { date: "2024-04-18", aqi: 155, pm10: 110, pm25: 72 },
    { date: "2024-04-19", aqi: 160, pm10: 115, pm25: 75 },
    { date: "2024-04-20", aqi: 150, pm10: 108, pm25: 70 },
    { date: "2024-04-21", aqi: 142, pm10: 100, pm25: 65 },

    { date: "2024-04-22", aqi: 600, pm10: 596, pm25: 262 },
    { date: "2024-04-23", aqi: 1132, pm10: 92, pm25: 60 },
    { date: "2024-04-24", aqi: 1125, pm10: 88, pm25: 58 },
    { date: "2024-04-25", aqi: 1120, pm10: 885, pm25: 655 },
    { date: "2024-04-26", aqi: 118, pm10: 83, pm25: 54 },
    { date: "2024-04-27", aqi: 1122, pm10: 86, pm25: 56 },
    { date: "2024-04-28", aqi: 1130, pm10: 90, pm25: 60 },
    { date: "2024-04-29", aqi: 838, pm10: 97, pm25: 64 },
    { date: "2024-04-30", aqi: 345, pm10: 102, pm25: 68 },
    { date: "2024-05-01", aqi: 550, pm10: 108, pm25: 70 },

    { date: "2024-05-02", aqi: 155, pm10: 112, pm25: 73 },
    { date: "2024-05-03", aqi: 160, pm10: 118, pm25: 76 },
    { date: "2024-05-04", aqi: 165, pm10: 120, pm25: 78 },
    { date: "2024-05-05", aqi: 170, pm10: 125, pm25: 80 },
    { date: "2024-05-06", aqi: 175, pm10: 128, pm25: 82 },
    { date: "2024-05-07", aqi: 168, pm10: 122, pm25: 79 },
    { date: "2024-05-08", aqi: 160, pm10: 115, pm25: 75 },
    { date: "2024-05-09", aqi: 152, pm10: 108, pm25: 70 },
    { date: "2024-05-10", aqi: 145, pm10: 102, pm25: 67 },
    { date: "2024-05-11", aqi: 138, pm10: 96, pm25: 63 },

    { date: "2024-05-12", aqi: 132, pm10: 92, pm25: 60 },
    { date: "2024-05-13", aqi: 128, pm10: 90, pm25: 58 },
    { date: "2024-05-14", aqi: 135, pm10: 95, pm25: 62 },
    { date: "2024-05-15", aqi: 142, pm10: 100, pm25: 65 },
    { date: "2024-05-16", aqi: 150, pm10: 108, pm25: 70 },
    { date: "2024-05-17", aqi: 160, pm10: 115, pm25: 74 },
    { date: "2024-05-18", aqi: 170, pm10: 123, pm25: 80 },
    { date: "2024-05-19", aqi: 178, pm10: 130, pm25: 85 },
    { date: "2024-05-20", aqi: 185, pm10: 138, pm25: 88 },
    { date: "2024-05-21", aqi: 190, pm10: 142, pm25: 92 },

    { date: "2024-05-22", aqi: 180, pm10: 135, pm25: 86 },
    { date: "2024-05-23", aqi: 172, pm10: 125, pm25: 80 },
    { date: "2024-05-24", aqi: 165, pm10: 120, pm25: 76 },
    { date: "2024-05-25", aqi: 158, pm10: 115, pm25: 72 },
    { date: "2024-05-26", aqi: 150, pm10: 108, pm25: 68 },
    { date: "2024-05-27", aqi: 145, pm10: 102, pm25: 66 },
    { date: "2024-05-28", aqi: 140, pm10: 98, pm25: 64 },
    { date: "2024-05-29", aqi: 138, pm10: 96, pm25: 63 },
    { date: "2024-05-30", aqi: 142, pm10: 100, pm25: 65 },
    { date: "2024-05-31", aqi: 148, pm10: 106, pm25: 69 },

    { date: "2024-06-01", aqi: 155, pm10: 112, pm25: 72 },
    { date: "2024-06-02", aqi: 165, pm10: 120, pm25: 78 },
    { date: "2024-06-03", aqi: 175, pm10: 128, pm25: 82 },
    { date: "2024-06-04", aqi: 185, pm10: 135, pm25: 88 },
    { date: "2024-06-05", aqi: 195, pm10: 145, pm25: 94 },
    { date: "2024-06-06", aqi: 200, pm10: 150, pm25: 98 },
    { date: "2024-06-07", aqi: 190, pm10: 142, pm25: 92 },
    { date: "2024-06-08", aqi: 180, pm10: 134, pm25: 86 },
    { date: "2024-06-09", aqi: 170, pm10: 125, pm25: 80 },
    { date: "2024-06-10", aqi: 160, pm10: 118, pm25: 74 },

    { date: "2024-06-11", aqi: 155, pm10: 112, pm25: 72 },
    { date: "2024-06-12", aqi: 150, pm10: 108, pm25: 70 },
    { date: "2024-06-13", aqi: 145, pm10: 104, pm25: 68 },
    { date: "2024-06-14", aqi: 140, pm10: 100, pm25: 65 },
    { date: "2024-06-15", aqi: 135, pm10: 96, pm25: 62 },
    { date: "2024-06-16", aqi: 130, pm10: 92, pm25: 60 },
    { date: "2024-06-17", aqi: 128, pm10: 90, pm25: 58 },
    { date: "2024-06-18", aqi: 132, pm10: 94, pm25: 60 },
    { date: "2024-06-19", aqi: 138, pm10: 98, pm25: 63 },
    { date: "2024-06-20", aqi: 145, pm10: 104, pm25: 67 },

    { date: "2024-06-21", aqi: 152, pm10: 110, pm25: 70 },
    { date: "2024-06-22", aqi: 160, pm10: 118, pm25: 75 },
    { date: "2024-06-23", aqi: 170, pm10: 125, pm25: 80 },
    { date: "2024-06-24", aqi: 180, pm10: 134, pm25: 86 },
    { date: "2024-06-25", aqi: 190, pm10: 142, pm25: 92 },
    { date: "2024-06-26", aqi: 120, pm10: 80, pm25: 55 },
    { date: "2024-06-27", aqi: 150, pm10: 95, pm25: 65 },
    { date: "2024-06-28", aqi: 90, pm10: 60, pm25: 40 },
    { date: "2024-06-29", aqi: 180, pm10: 110, pm25: 78 },
    { date: "2024-06-30", aqi: 140, pm10: 85, pm25: 58 },
]


const chartConfig = {
    aqi: {
        label: "AQI",
        color: "var(--chart-1)",
    },
    pm10: {
        label: "PM10",
        color: "var(--chart-2)",
    },
    pm25: {
        label: "PM2.5",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

export function ChartAreaInteractive() {
    const [timeRange, setTimeRange] = React.useState("7d")

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")

        let daysToSubtract = 7
        if (timeRange === "30d") daysToSubtract = 30
        if (timeRange === "90d") daysToSubtract = 90

        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)

        return date >= startDate
    })

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Air Quality Trends</CardTitle>
                    <CardDescription>
                        Showing AQI, PM10 and PM2.5 data ({timeRange})
                    </CardDescription>
                </div>

                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
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
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillAQI" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-aqi)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-aqi)" stopOpacity={0.1} />
                            </linearGradient>

                            <linearGradient id="fillPM10" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-pm10)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-pm10)" stopOpacity={0.1} />
                            </linearGradient>

                            <linearGradient id="fillPM25" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-pm25)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-pm25)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
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

                        <Area
                            dataKey="aqi"
                            type="natural"
                            fill="url(#fillAQI)"
                            stroke="var(--color-aqi)"
                            stackId="a"
                        />

                        <Area
                            dataKey="pm10"
                            type="natural"
                            fill="url(#fillPM10)"
                            stroke="var(--color-pm10)"
                            stackId="a"
                        />

                        <Area
                            dataKey="pm25"
                            type="natural"
                            fill="url(#fillPM25)"
                            stroke="var(--color-pm25)"
                            stackId="a"
                        />

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
