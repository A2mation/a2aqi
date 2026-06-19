"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
} from "recharts";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { cn } from "@/lib/utils";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/utils/formatDateTime";
import { useDeviceStore } from "@/store/use-device.store";
import { SubscriptionExpireWheel } from "./SubscriptionExpireWheel";
import { getAQIBgColor, getAQIColor, getAQIStatus, getAQITextColor } from "@/helpers/aqi-color-pallet";

const AirQualityImages: Record<string, string> = {
    Good: "/assets/aqi-moods/Good.png",
    Moderate: "/assets/aqi-moods/Moderate.png",
    Poor: "/assets/aqi-moods/Poor.png",
    Unhealthy: "/assets/aqi-moods/Unhealthy.png",
    Severe: "/assets/aqi-moods/Severe.png",
    Hazardous: "/assets/aqi-moods/Hazard.png",
};

const sensorIcons: Record<string, string> = {
    pm25: "/assets/pm2.5-parameter.png",
    pm10: "/assets/pm10-perameter.png",
    pm1: "/assets/pm1-parameter.png",
    temperature: "/assets/temperature.svg",
    humidity: "/assets/humidity.svg",
    noise: "/assets/noise.svg",
    tvoc: "/assets/tvoc.svg",
};

export function StatsCards() {
    const { deviceId } = useParams();
    const { selectedDeviceActiveStatus } = useDeviceStore();

    const { data, isPending, error } = useQuery({
        queryKey: ["dashboardOverview", deviceId],
        queryFn: async () => {
            const res = await http.get(
                `/api/user/dashboard/overview?deviceId=${deviceId}`
            );
            return res.data;
        },
    });

    if (isPending) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[0, 1, 2].map((_, index) => (
                        <Skeleton key={index} className="h-40 w-full rounded-xl bg-white" />
                    ))}
                </div>

                <Skeleton className="h-40 w-full rounded-xl bg-white" />
            </div>
        );
    }

    if (error) {
        return (
            <p className="text-sm text-red-500">
                Failed to load latest sensor data
            </p>
        );
    }
    const latest = data?.data?.latest;
    const aqiLevel = data?.data?.daily?.aqiLevel ?? "Moderate";
    // console.log(aqiLevel)

    if (!latest) {
        return (
            <p className="text-sm text-muted-foreground">
                No latest sensor data found
            </p>
        );
    }


    // pollutants row
    const pollutants = [
        { key: "temperature", label: "Temperature", value: latest.temperature, unit: "°C", icon: sensorIcons.temperature },
        { key: "humidity", label: "Humidity", value: latest.humidity, unit: "%", icon: sensorIcons.humidity },

        { key: "pm25", label: "PM2.5", value: latest.pm25, unit: "µg/m³", icon: sensorIcons.pm25 },
        { key: "pm10", label: "PM10", value: latest.pm10, unit: "µg/m³", icon: sensorIcons.pm10 },
        { key: "pm1", label: "PM1", value: latest.pm1, unit: "µg/m³", icon: sensorIcons.pm1 },

        { key: "so2", label: "SO₂", value: latest.so2, unit: "ppb", icon: sensorIcons.so2 },
        { key: "no2", label: "NO₂", value: latest.no2, unit: "ppb", icon: sensorIcons.no2 },
        { key: "co2", label: "CO₂", value: latest.co2, unit: "ppm", icon: sensorIcons.co2 },
        { key: "co", label: "CO", value: latest.co, unit: "ppm", icon: sensorIcons.co },
        { key: "o3", label: "O₃", value: latest.o3, unit: "ppb", icon: sensorIcons.o3 },

        { key: "tvoc", label: "TVOC", value: latest.tvoc, unit: "ppb", icon: sensorIcons.tvoc },
        { key: "smoke", label: "Smoke", value: latest.smoke, unit: "ppm", icon: sensorIcons.smoke },
        { key: "methane", label: "Methane", value: latest.methane, unit: "ppm", icon: sensorIcons.methane },
        { key: "h2", label: "H₂", value: latest.h2, unit: "ppm", icon: sensorIcons.h2 },
        { key: "ammonia", label: "Ammonia", value: latest.ammonia, unit: "ppm", icon: sensorIcons.ammonia },
        { key: "h2s", label: "H₂S", value: latest.h2s, unit: "ppm", icon: sensorIcons.h2s },

        { key: "noise", label: "Noise", value: latest.noise, unit: "dB", icon: sensorIcons.noise },

    ].filter((item) => item.value !== null && item.value !== undefined);


    const chartConfig = {
        aqi: {
            label: "AQI",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;


    return (
        <div className="space-y-5">
            {/* TOP CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* AQI Card */}
                <Card className="p-6 shadow hover:shadow-xl rounded-xl border border-border bg-white">
                    <div className="grid grid-cols-2 gap-4 items-center">

                        {/* LEFT SIDE */}
                        <div className="space-y-4">
                            <Badge variant="secondary" className="w-fit text-base hidden md:flex">
                                Sensor
                            </Badge>

                            <div className="flex md:hidden items-center gap-3">
                                {selectedDeviceActiveStatus ? (
                                    /* Online State Badge */
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 max-w-max animate-in fade-in duration-300">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-xs font-semibold tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
                                            Online
                                        </span>
                                    </div>
                                ) : (
                                    /* Offline State Badge */
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-full border border-destructive/20 max-w-max animate-in fade-in duration-300">
                                        <div className="h-2 w-2 bg-destructive rounded-full opacity-60" />
                                        <span className="text-xs font-semibold tracking-wide uppercase text-destructive">
                                            Offline
                                        </span>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-base sm:text-xl font-bold text-gray-800">
                                Air Quality Index
                            </h2>

                            <div>
                                <p className={cn("text-5xl font-bold", getAQITextColor(Math.round(latest.aqi)))}>
                                    {Math.round(latest.aqi)}
                                </p>

                                <div className="mt-3">
                                    <Badge
                                        className={cn(
                                            "text-white px-4 py-1 rounded-md text-xl",
                                            getAQIBgColor(Math.round(Number(latest.aqi))),
                                            `hover:${getAQIBgColor(Math.round(Number(latest.aqi)))}`
                                        )}
                                    >
                                        {getAQIStatus(Math.round(Number(latest.aqi))).toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE IMAGE */}
                        <div className="flex justify-end">
                            <Image
                                src={AirQualityImages[getAQIStatus(latest.aqi)] ?? AirQualityImages["Moderate"]}
                                width={90}
                                height={90}
                                alt="AQI"
                            />
                        </div>
                    </div>

                    {/* FOOTER */}
                    <p className="text-xs text-gray-400 mt-5">
                        Last Updated: {formatDateTime(data?.data?.latest.measuredAt) ?? "N/A"}
                    </p>
                </Card>


                {/* Avg AQI Trends */}
                <Card className="p-6 rounded-xl shadow hover:shadow-xl border border-border bg-white">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        Avg. AQI Trends
                    </h2>

                    <p className="text-sm text-gray-500 mb-2">
                        Daily AQI Summary (Min / Avg / Max)
                    </p>

                    <ChartContainer config={chartConfig} className="h-40 w-full">
                        <BarChart
                            data={[
                                { name: "Min", aqi: data?.data?.daily?.minAqi ?? 0 },
                                { name: "Avg", aqi: data?.data?.daily?.avgAqi ?? 0 },
                                { name: "Max", aqi: data?.data?.daily?.maxAqi ?? 0 },
                            ]}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />

                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                fontSize={12}
                            />


                            <ChartTooltip content={<ChartTooltipContent />} />

                            <Bar dataKey="aqi" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                <Cell fill={getAQIColor(Math.round(data?.data?.daily?.minAqi))} />
                                <Cell fill={getAQIColor(Math.round(data?.data?.daily?.avgAqi))} />
                                <Cell fill={getAQIColor(Math.round(data?.data?.daily?.maxAqi))} />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </Card>


                {/* Subscription Wheel Monitor */}
                <SubscriptionExpireWheel />
            </div>

            {/* AIR POLLUTANTS STRIP */}
            <Card className="p-6 rounded-xl border border-border ">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Air Pollutants
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {pollutants.map((item) => (
                        <div key={item.key} className="flex flex-col items-center text-center bg-background py-4 rounded-2xl">
                            <div className="flex flex-col md:flex-row gap-2 px-10 mb-2 items-center justify-between w-full">
                                {item.icon && (
                                    <Image
                                        src={item.icon}
                                        width={80}
                                        height={80}
                                        alt={item.label}
                                    />
                                )}

                                <div className="">
                                    <p className="text-base md:text-lg font-medium text-gray-700 mt-2">
                                        {item.label}
                                    </p>

                                    <p className="text-lg md:text-2xl font-bold text-gray-900">
                                        {item.value}
                                        <span className="text-xs md:text-base text-gray-500 ml-1">
                                            {item.unit}
                                        </span>
                                    </p>

                                </div>
                            </div>

                            <div className="w-[90%] h-1 bg-gray-200 rounded-full mt-2">
                                <div className={cn(
                                    "w-1/2 h-1  rounded-full",
                                    getAQIBgColor(Math.round(item.value))
                                )}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
