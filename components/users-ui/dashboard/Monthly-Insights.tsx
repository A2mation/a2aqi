"use client"
import { useState } from "react";
import { ChevronDown, Video } from "lucide-react"


import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MonthlyInsights() {
    const [selectedMonth, setSelectedMonth] = useState('February');

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const aqiCategories = [
        { label: 'Good', color: 'bg-green-500', days: '0 Day' },
        { label: 'Moderate', color: 'bg-yellow-400', days: '0 Day' },
        { label: 'Poor', color: 'bg-orange-500', days: '0 Day' },
        { label: 'Unhealthy', color: 'bg-pink-500', days: '0 Day' },
        { label: 'Severe', color: 'bg-purple-600', days: '0 Day' },
        { label: 'Hazardous', color: 'bg-red-600', days: '1 Day' },
    ];

    const chartData = [
        { day: "1", aqi: 186 },
        { day: "2", aqi: 305 },
        { day: "3", aqi: 237 },
        { day: "4", aqi: 73 },
        { day: "5", aqi: 209 },
        { day: "6", aqi: 214 },
        { day: "7", aqi: 198 },
        { day: "8", aqi: 176 },
        { day: "9", aqi: 221 },
        { day: "10", aqi: 245 },
        { day: "11", aqi: 190 },
        { day: "12", aqi: 132 },
        { day: "13", aqi: 165 },
        { day: "14", aqi: 210 },
        { day: "15", aqi: 287 },
        { day: "16", aqi: 301 },
        { day: "17", aqi: 260 },
        { day: "18", aqi: 155 },
        { day: "19", aqi: 98 },
        { day: "20", aqi: 120 },
        { day: "21", aqi: 178 },
        { day: "22", aqi: 225 },
        { day: "23", aqi: 240 },
        { day: "24", aqi: 310 },
        { day: "25", aqi: 275 },
        { day: "26", aqi: 205 },
        { day: "27", aqi: 160 },
        { day: "28", aqi: 140 },
    ];


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
                    <Button
                        variant="outline"
                        className="w-full md:w-auto flex items-center justify-between gap-2 bg-transparent"
                        onClick={() => { }} // Add dropdown functionality as needed
                    >
                        {selectedMonth}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="w-full bg-background p-4 md:p-6 lg:p-8">
                <div className="space-y-6">

                    {/* Average Section */}
                    <div className="flex flex-col justify-center bg-slate-50 rounded-lg p-4 md:p-6 lg:flex-1">
                        <p className="text-sm text-slate-600 mb-2">{selectedMonth} Avg.</p>
                        <p className="text-4xl md:text-5xl font-bold text-red-600">586</p>
                    </div>

                    {/* Progress and Date Section */}
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="aqi" fill="var(--color-aqi)" radius={4} />
                        </BarChart>
                    </ChartContainer>

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
                            <p className="text-sm text-slate-500">On Til 4th {selectedMonth}</p>
                            <div className="bg-red-600 text-white font-bold rounded px-4 py-2">586</div>
                        </div>
                    </div>

                    {/* Max Card */}
                    <div className="bg-slate-50 rounded-lg p-4 md:p-6 space-y-3">
                        <p className="text-sm text-slate-600 font-medium">Max.</p>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">On Til 4th {selectedMonth}</p>
                            <div className="bg-red-600 text-white font-bold rounded px-4 py-2">586</div>
                        </div>
                    </div>
                </div>
            </div>

        </Card>
    )
}
