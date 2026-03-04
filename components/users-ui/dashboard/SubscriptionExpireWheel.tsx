"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell, Label } from "recharts"

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
    { status: "active", count: 275, fill: "#10b981" },
    { status: "expiring", count: 120, fill: "#f59e0b" },
    { status: "expired", count: 45, fill: "#f43f5e" },
]

const chartConfig = {
    active: { label: "Active", color: "#10b981" },
    expiring: { label: "Expiring", color: "#f59e0b" },
    expired: { label: "Expired", color: "#f43f5e" },
} satisfies ChartConfig

export function SubscriptionExpireWheel() {
    const totalDevices = chartData.reduce((acc, curr) => acc + curr.count, 0)

    return (
        <Card className="flex flex-col border-none shadow hover:shadow-xl bg-linear-to-b from-card to-muted/20">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-500 to-amber-500">
                    Device Health
                </CardTitle>
                <CardDescription className="text-xs font-medium">Real-time status tracking</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto h-30 w-full"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel className="rounded-lg border-none shadow-lg" />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={35}
                            outerRadius={60}
                            paddingAngle={8}
                            cornerRadius={4}

                            strokeWidth={0}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                                                    {totalDevices}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16} className="fill-muted-foreground text-[10px] uppercase">
                                                    Total
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 pt-4">
                <div className="flex w-full items-center justify-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#10b981]" /> Active</div>
                    <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#f59e0b]" /> Expiring</div>
                    <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#f43f5e]" /> Expired</div>
                </div>
            </CardFooter>
        </Card>
    )
}