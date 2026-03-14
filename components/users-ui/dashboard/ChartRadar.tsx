"use client"

import { TrendingUp, Lock } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 273 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function ChartRadar() {
    return (
        <Card className="relative border-none shadow-md">
            {/* Overlay: Coming Soon Badge */}
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/10 backdrop-blur-[1px]">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-xl backdrop-blur-xl transition-transform hover:scale-105">
                    <Lock className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Under Development</span>
                </div>
            </div>

            {/* Blurred Content */}
            <div className="select-none blur-md opacity-30 grayscale-[0.5]">
                <CardHeader className="items-center">
                    <CardTitle>AQI Analysis</CardTitle>
                    <CardDescription>
                        Showing total aqi for the last 6 months
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-62.5"
                    >
                        <RadarChart data={chartData}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <PolarAngleAxis dataKey="month" />
                            <PolarGrid />
                            <Radar
                                dataKey="desktop"
                                fill="var(--color-desktop)"
                                fillOpacity={0.6}
                                dot={{
                                    r: 4,
                                    fillOpacity: 1,
                                }}
                            />
                        </RadarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 leading-none font-medium">
                        AQI up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 leading-none">
                        January - June 2026
                    </div>
                </CardFooter>
            </div>
        </Card>
    )
}