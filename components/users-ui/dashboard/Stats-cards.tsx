"use client";

import Image from "next/image";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { http } from "@/lib/http";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { getAQIBgColor, getAQIColor, getAQIStatus, getAQITextColor } from "@/helpers/aqi-color-pallet";
import { formatDateTime } from "@/utils/formatDateTime";
import { DeviceManagement } from "./Device-Mangement";

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
    const deviceId = "698db75ef96c5dfba830ca22";

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

        { key: "temperature", label: "Temperature", value: latest.temperature, unit: "°C", icon: sensorIcons.temperature },
        { key: "humidity", label: "Humidity", value: latest.humidity, unit: "%", icon: sensorIcons.humidity },
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
                <Card className="p-6 rounded-xl border border-border bg-white">
                    <div className="grid grid-cols-2 gap-4 items-center">

                        {/* LEFT SIDE */}
                        <div className="space-y-4">
                            <Badge variant="secondary" className="w-fit text-base">
                                Sensor
                            </Badge>

                            <h2 className="text-base sm:text-xl font-bold text-gray-800">
                                Air Quality Index
                            </h2>

                            <div>
                                <p className={cn("text-5xl font-bold", getAQITextColor(latest.aqi))}>
                                    {latest.aqi}
                                </p>

                                <div className="mt-3">
                                    <Badge
                                        className={cn(
                                            "text-white px-4 py-1 rounded-md text-xl",
                                            getAQIBgColor(latest.aqi),
                                            `hover:${getAQIBgColor(latest.aqi)}`
                                        )}
                                    >
                                        {getAQIStatus(latest.aqi).toUpperCase()}
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
                <Card className="p-6 rounded-xl border border-border bg-white">
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
                                <Cell fill={getAQIColor(data?.data?.daily?.minAqi)} />
                                <Cell fill={getAQIColor(data?.data?.daily?.avgAqi)} />
                                <Cell fill={getAQIColor(data?.data?.daily?.maxAqi)} />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </Card>


                {/* Device Monitor */}
                <DeviceManagement />
            </div>

            {/* AIR POLLUTANTS STRIP */}
            <Card className="p-6 rounded-xl border border-border ">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Air Pollutants
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {pollutants.map((item) => (
                        <div key={item.key} className="flex flex-col items-center text-center bg-background py-4 rounded-2xl">
                            {item.icon && (
                                <Image
                                    src={item.icon}
                                    width={28}
                                    height={28}
                                    alt={item.label}
                                />
                            )}

                            <p className="text-sm font-medium text-gray-700 mt-2">
                                {item.label}
                            </p>

                            <p className="text-lg font-bold text-gray-900">
                                {item.value}
                                <span className="text-xs text-gray-500 ml-1">
                                    {item.unit}
                                </span>
                            </p>

                            <div className="w-[90%] h-1 bg-gray-200 rounded-full mt-2">
                                <div className={cn(
                                    "w-1/2 h-1  rounded-full",
                                    getAQIBgColor(item.value)
                                )}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
