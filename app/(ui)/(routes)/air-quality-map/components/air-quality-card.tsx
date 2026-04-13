"use client";

import Image from 'next/image';
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Activity, Info, TrendingUp, AlertCircle, Wind, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    getAQIBgColor,
    getAQITextColor,
    getAQITheme,
} from "@/helpers/aqi-color-pallet";
import { useLocationStore } from "@/store/location.store";
import { detectGpsLocation } from "@/store/location.actions";
import { Graph } from "./graph";
import { StationData } from "./map";
import { http } from "@/lib/http";

type AirQualityCardProps = {
    station: StationData | null;
    onCloseAction?: () => void;
};

export function AirQualityCard({ station, onCloseAction }: AirQualityCardProps) {
    const store = useLocationStore();
    const router = useRouter();

    const deviceId = station?.id;

    const { data: apiData, isLoading, isError } = useQuery({
        queryKey: ["pollutant-details", deviceId],
        queryFn: async () => {
            if (!deviceId) return null;
            const response = await http.get(`/api/maps/pollutant-details?deviceId=${deviceId}`);
            if (!response.data.success) throw new Error("Failed to fetch air quality data");
            return response.data;
        },
        enabled: !!deviceId,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 10,
    });;

    useEffect(() => {
        if (!station && !store.city) {
            detectGpsLocation();
        }
    }, [station, store.city]);

    const AirQualityImages: Record<string, string> = {
        Good: "/assets/aqi-moods/Good.png",
        Moderate: "/assets/aqi-moods/Moderate.png",
        Poor: "/assets/aqi-moods/Poor.png",
        Unhealthy: "/assets/aqi-moods/Unhealthy.png",
        Severe: "/assets/aqi-moods/Severe.png",
        Hazardous: "/assets/aqi-moods/Hazard.png",
    };

    const current = apiData?.current;

    const displayData = useMemo(() => {
        const allPollutants = [
            { id: "aqi", label: "AQI", value: current?.aqi, unit: "", max: 1000 },
            { id: "pm10", label: "PM 10", value: current?.pm10, unit: "μg/m³", max: 1000 },
            { id: "pm25", label: "PM 2.5", value: current?.pm25, unit: "μg/m³", max: 1000 },
            { id: "so2", label: "SO₂", value: current?.so2, unit: "ppb", max: 100 },
            { id: "no2", label: "NO₂", value: current?.no2, unit: "ppb", max: 100 },
            { id: "co2", label: "CO₂", value: current?.co2, unit: "ppm", max: 2000 },
            { id: "co", label: "CO", value: current?.co, unit: "ppm", max: 15 },
            { id: "o3", label: "O₃", value: current?.o3, unit: "ppb", max: 180 },
            { id: "noise", label: "Noise", value: current?.noise, unit: "dB", max: 120 },
            { id: "pm1", label: "PM 1", value: current?.pm1, unit: "μg/m³", max: 100 },
            { id: "tvoc", label: "TVOC", value: current?.tvoc, unit: "ppb", max: 1000 },
            { id: "smoke", label: "Smoke", value: current?.smoke, unit: "%", max: 100 },
            { id: "methane", label: "Methane", value: current?.methane, unit: "ppm", max: 1000 },
            { id: "h2", label: "H₂", value: current?.h2, unit: "ppm", max: 1000 },
            { id: "ammonia", label: "Ammonia", value: current?.ammonia, unit: "ppm", max: 100 },
            { id: "h2s", label: "H₂S", value: current?.h2s, unit: "ppm", max: 100 },
            { id: "temperature", label: "Temp", value: current?.temperature, unit: "°C", max: 50 },
            { id: "humidity", label: "Humidity", value: current?.humidity, unit: "%", max: 100 },
        ];

        // Filter only fields that have a value
        const activePollutants = allPollutants.filter(p => p.value !== null && p.value !== undefined);

        return {
            name: current?.location ?? current?.name ?? store.city ?? "Location",
            aqi: current?.aqi ?? station?.aqi ?? store.aqi ?? 0,
            pollutants: activePollutants
        };
    }, [current, station, store]);

    const theme = getAQITheme(displayData.aqi);
    const moodImage = AirQualityImages[theme.label];

    if (isLoading) {
        return <AirQualityCardSkeleton />;
    }

    // Handle Error State
    if (isError) {
        return (
            <Card className="w-full max-w-105 p-10 flex flex-col items-center justify-center text-center space-y-4 rounded-[2.5rem] bg-white border-none shadow-xl">
                <div className="p-4 bg-red-50 rounded-full">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold text-zinc-800">Connection Failed</h3>
                    <p className="text-sm text-zinc-500">We couldn't reach the sensor station. Please check your internet.</p>
                </div>
                <button
                    onClick={() => router.refresh()}
                    className="px-6 py-2 bg-zinc-900 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-colors"
                >
                    Try Again
                </button>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-105 h-full md:h-[88dvh] bg-white text-zinc-900 border-none shadow-[0_-10px_40px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden rounded-t-[2.5rem] md:rounded-[2.5rem]">

            <button
                onClick={onCloseAction}
                className="absolute top-6 right-6 z-20 p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors group"
            >
                <X className="w-5 h-5 text-zinc-500 group-hover:text-zinc-800" />
            </button>

            <div className="flex flex-col items-center pt-4 pb-1 cursor-grab active:cursor-grabbing">
                <p className="text-[11px] text-zinc-300 text-center font-bold uppercase pt-2">
                    Sensor Sync: {current?.measuredAt ? new Date(current.measuredAt).toLocaleTimeString() : 'Updating...'}
                </p>
            </div>

            <CardContent className="flex-1 overflow-y-auto custom-scroll px-7 pb-8 space-y-7">

                {/* HEADER */}
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-bold text-zinc-800 flex items-center gap-2 mb-2">
                        <Wind className="w-7 h-7 mt-0.5 shrink-0 text-cyan-500" />
                        <span className="text-cyan-500 font-black italic">AQI</span>
                        <span className="font-semibold text-zinc-600">Air Quality Map</span>
                    </h1>
                    <div className="flex items-start gap-1.5 text-blue-500/90">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 fill-current/10" />
                        <span className="text-[15px] font-bold leading-tight">{displayData.name}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-blue-500/90">
                        <span className="text-sm leading-tight">Source : </span>
                        <span className="text-sm font-bold leading-tight">{current.source === 'Internal' ? 'A2AQI' : 'CPCB'}</span>
                    </div>
                </div>

                {/*  HERO */}
                <div className="relative min-h-30 flex items-center">
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-2.5">
                            <Wind className="w-4 h-4 text-cyan-500" />
                            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Live Status</span>
                        </div>

                        <div className="flex items-center gap-5">
                            <span className={cn("text-7xl font-black tracking-tighter leading-none", getAQITextColor(displayData.aqi))}>
                                {displayData.aqi}
                            </span>
                            <div className={cn(
                                "px-6 py-2 rounded-xl text-white font-black text-sm uppercase tracking-tight shadow-lg shadow-current/20",
                                getAQIBgColor(displayData.aqi)
                            )}>
                                {theme.label}
                            </div>
                        </div>
                    </div>

                    {moodImage && (
                        <div className="absolute -right-4 bottom-0 scale-110 pointer-events-none">
                            <Image src={moodImage} width={80} height={80} alt="Mood" className="object-contain drop-shadow-2xl" priority />
                        </div>
                    )}
                </div>

                {/* POLLUTANTS */}
                <div className="grid grid-cols-1 gap-4 bg-zinc-50/80 p-5 rounded-4xl border border-zinc-100">
                    {displayData.pollutants.map((p) => (
                        <div key={p.id} className="group">
                            <div className="flex justify-between items-end mb-2 px-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{p.label}</span>
                                    <TrendingUp className="w-3 h-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-xs font-medium text-zinc-400">
                                    <b className="text-zinc-900 font-bold text-sm">{p.value}</b> {p.unit}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-zinc-200/60 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-700 ease-out", getAQIBgColor(Number(p.value)))}
                                    style={{ width: `${Math.min((Number(p.value) / p.max) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER: Graph Integration */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-zinc-400" />
                            <h3 className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest">7-Day History</h3>
                        </div>
                        <Info className="w-4 h-4 text-zinc-300 hover:text-cyan-500 cursor-help" />
                    </div>
                    <div className="h-32 w-full bg-zinc-50/50 rounded-2xl p-2 border border-zinc-100/50">

                        <Graph data={apiData?.history || []} isLoading={isLoading} />

                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


function AirQualityCardSkeleton() {
    return (
        <Card className="w-full max-w-105 bg-white border-none shadow-[0_-10px_40px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden rounded-t-[2.5rem] md:rounded-[2.5rem] animate-pulse">
            {/* Scroll Indicator Placeholder */}
            <div className="flex flex-col items-center pt-4 pb-2">
                <div className="h-2.5 w-20 bg-zinc-200 rounded-full" />
            </div>

            <CardContent className="px-7 pb-8 space-y-7">
                {/* HEADER Placeholder */}
                <div className="space-y-3">
                    <div className="h-8 w-48 bg-zinc-200 rounded-lg" />
                    <div className="h-4 w-32 bg-zinc-100 rounded-md" />
                </div>

                {/* HERO Placeholder */}
                <div className="relative min-h-30 flex items-center justify-between">
                    <div className="space-y-4">
                        <div className="h-3 w-24 bg-zinc-100 rounded-full" />
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-24 bg-zinc-200 rounded-2xl" />
                            <div className="h-10 w-28 bg-zinc-200 rounded-xl" />
                        </div>
                    </div>
                    {/* Mood Character Placeholder */}
                    <div className="w-20 h-20 bg-zinc-100 rounded-full mr-2" />
                </div>

                {/* POLLUTANTS Placeholder (Showing 4 bars) */}
                <div className="space-y-5 bg-zinc-50/80 p-5 rounded-4xl border border-zinc-100">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between">
                                <div className="h-3 w-12 bg-zinc-200 rounded-full" />
                                <div className="h-3 w-16 bg-zinc-200 rounded-full" />
                            </div>
                            <div className="h-2 w-full bg-zinc-200/60 rounded-full" />
                        </div>
                    ))}
                </div>

                {/* GRAPH Placeholder */}
                <div className="space-y-4">
                    <div className="h-4 w-32 bg-zinc-200 rounded-full" />
                    <div className="h-32 w-full bg-zinc-100/50 rounded-2xl" />
                    <div className="h-2.5 w-24 bg-zinc-100 rounded-full mx-auto" />
                </div>
            </CardContent>
        </Card>
    );
}