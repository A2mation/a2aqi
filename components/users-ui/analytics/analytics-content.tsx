"use client";

import { Card } from "@/components/ui/card";
import {
    TrendingUp,
    ArrowUpRight,
    Thermometer,
    Wind,
    Droplets,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChartAreaInteractive } from "./chart-analytics";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";

type QuarterlyRecord = {
    dayStart: string;
    count: number;
    [key: string]: any;
};

const allMetrics = [
    { key: "avgAqi", label: "AQI", icon: Wind },
    { key: "avgPm25", label: "PM2.5", icon: Wind },
    { key: "avgPm10", label: "PM10", icon: Wind },
    { key: "avgTemperature", label: "Temperature", icon: Thermometer },
    { key: "avgHumidity", label: "Humidity", icon: Droplets },
    { key: "avgCo2", label: "CO2", icon: Wind },
    { key: "avgNo2", label: "NO2", icon: Wind },
    { key: "avgSo2", label: "SO2", icon: Wind },
    { key: "avgO3", label: "O3", icon: Wind },
    { key: "avgNoise", label: "Noise", icon: Wind },
    { key: "avgTvoc", label: "TVOC", icon: Wind },
    { key: "avgSmoke", label: "Smoke", icon: Wind },
    { key: "avgMethane", label: "Methane", icon: Wind },
    { key: "avgH2", label: "H2", icon: Wind },
    { key: "avgAmmonia", label: "Ammonia", icon: Wind },
    { key: "avgH2s", label: "H2S", icon: Wind },
    { key: "avgPM1", label: "PM1", icon: Wind },
] as const;

export function AnalyticsContent() {
    const { deviceId } = useParams();

    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<string>("avgAqi");

    // const today = new Date().toISOString().split("T")[0];

    const today = new Date();
    today.setDate(today.getDate() + 1);

    const dateString = today.toISOString().split("T")[0];


    const { data, isLoading, isError } = useQuery<QuarterlyRecord[]>({
        queryKey: ["quarterly", deviceId, dateString],
        queryFn: async () => {
            const res = await fetch(
                `/api/user/dashboard/analysis?deviceId=${deviceId}&date=${dateString}`
            );

            if (!res.ok) throw new Error("Failed to fetch quarterly data");

            return res.json();
        },
    });

    const availableMetrics = allMetrics.filter((metric) =>
        data?.some((row) => row[metric.key] !== undefined)
    );

    const latest = data?.[data.length - 1];

    // ✅ Fix infinite re-render by using useEffect
    useEffect(() => {
        if (
            availableMetrics.length > 0 &&
            !availableMetrics.some((m) => m.key === selectedMetric)
        ) {
            setSelectedMetric(availableMetrics[0].key);
        }
    }, [availableMetrics, selectedMetric]);

    if (isLoading) {
        return <div className="p-4 text-sm opacity-70">Loading analytics...</div>;
    }

    if (isError) {
        return (
            <div className="p-4 text-sm text-red-500">Failed to load analytics.</div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* METRIC SELECT */}
            <div className="flex justify-end">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-50">
                        <SelectValue placeholder="Select Metric" />
                    </SelectTrigger>

                    <SelectContent>
                        {availableMetrics.map((m) => (
                            <SelectItem key={m.key} value={m.key}>
                                {m.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {availableMetrics.slice(0, 4).map((metric, index) => {
                    const Icon = metric.icon;

                    return (
                        <Card
                            key={metric.key}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className={`bg-card text-foreground p-4 transition-all duration-500 ease-out animate-slide-in-up cursor-pointer ${hoveredCard === index
                                ? "scale-105 shadow-2xl"
                                : "shadow-lg"
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="text-base font-medium opacity-90">
                                        {metric.label}
                                    </h3>
                                </div>

                                <div
                                    className={`w-6 h-6 rounded-full bg-primary flex items-center justify-center transition-transform duration-300 ${hoveredCard === index ? "rotate-45" : ""
                                        }`}
                                >
                                    <ArrowUpRight className="w-3 h-3 text-primary-foreground" />
                                </div>
                            </div>

                            <p className="text-3xl font-bold mb-2">
                                {latest?.[metric.key] ?? "--"}
                            </p>

                            <div className="flex items-center gap-1.5 text-xs opacity-80">
                                <TrendingUp className="w-3 h-3 text-green-600" />
                                <span className="text-muted-foreground">
                                    Last 90 days
                                </span>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* CHART */}
            <div className="grid grid-cols-1 gap-6">
                <ChartAreaInteractive
                    data={data ?? []}
                    metricKey={selectedMetric}
                    metricLabel={
                        availableMetrics.find((m) => m.key === selectedMetric)?.label ??
                        "Metric"
                    }
                />
            </div>
        </div>
    );
}
