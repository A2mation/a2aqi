"use client"

import { useParams } from "next/navigation"
import { Pie, PieChart, Label } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { format, differenceInDays } from "date-fns"
import { DeviceSubscription } from "@prisma/client"
import { Calendar, CreditCard } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    type ChartConfig,
} from "@/components/ui/chart"
import { http } from "@/lib/http"

import { SubscriptionExpireWheelSkeleton } from "./loader/SubscriptionExpireWheelSkeleton"

interface DeviceSub {
    source: string,
    data: DeviceSubscription,
    success: boolean
}

export function SubscriptionExpireWheel() {
    const {
        deviceId
    } = useParams();
    const today = new Date()

    const {
        data: sub,
        isLoading,
    } = useQuery<DeviceSub>({
        queryKey: ["user-subscriptions", deviceId],
        queryFn: async () => {
            const res = await http.get<DeviceSub>("/api/user/subscription/validate", {
                params: {
                    deviceId
                }
            });
            return res.data;
        },
        enabled: !!deviceId,
        staleTime: 1000 * 60 * 10
    });

    if (isLoading) return <SubscriptionExpireWheelSkeleton />;

    if (!sub) return null;

    const expiryDate = sub.data.endDate;
    const actualDaysLeft = differenceInDays(expiryDate, today)
    const daysRemaining = Math.max(0, Math.min(actualDaysLeft, 365))

    const totalCycle = 365
    const elapsedDays = totalCycle - daysRemaining;

    const colors = {
        good: "#10b981",    // Green
        warning: "#f59e0b", // Yellow
        critical: "#f43f5e",// Red
        elapsed: "#e2e8f0"  // Gray
    }

    let activeColor = colors.good;

    if (daysRemaining <= 20) {
        activeColor = colors.critical;
    } else if (daysRemaining <= 60) {
        activeColor = colors.warning;
    }

    const chartData = [
        { status: "active", count: daysRemaining, fill: activeColor },
        { status: "elapsed", count: elapsedDays, fill: colors.elapsed },
    ]

    const chartConfig = {
        active: { label: "Days Remaining", color: activeColor },
        elapsed: { label: "Days Passed", color: colors.elapsed },
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col border shadow-none rounded-xl h-full">
            <CardHeader className="items-start px-6 pt-6 pb-0">
                <CardTitle>
                    <div className="flex justify-between ">
                        <span className="text-xl font-bold text-[#059669]">
                            Subscription Status
                        </span>
                        <div className="flex items-center gap-2.5 text-[11px] font-semibold text-muted-foreground bg-slate-100/80 px-4 py-2 rounded-full border border-slate-200">
                            <CreditCard className="h-3.5 w-3.5" />
                            Renew date: {format(expiryDate, "MMM dd, yyyy")}
                        </div>
                    </div>
                </CardTitle>
                <CardDescription className="text-[12px] font-medium flex items-center gap-1 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(), "MMMM do, yyyy")}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex items-center justify-center p-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto h-45 w-full"
                >
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={55}  /* Thinner, more modern donut */
                            outerRadius={75}
                            paddingAngle={0}
                            cornerRadius={0}
                            strokeWidth={0}
                            startAngle={90}
                            endAngle={450}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-black">
                                                    {daysRemaining}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                                                    Days Left
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
        </Card>
    )
}