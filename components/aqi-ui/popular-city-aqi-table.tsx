"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Thermometer, Droplets, Wind, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type CityAQI = {
    location: string;
    aqi: number;
    temperature: number | null;
    humidity: number | null;
};

const landmarks: Record<string, string> = {
    Ahmedabad: "/assets/city-icons/ahmedabad.png",
    Bengaluru: "/assets/city-icons/bangalore.png",
    Chennai: "/assets/city-icons/chennai.png",
    Hyderabad: "/assets/city-icons/hyderabad.png",
    Kolkata: "/assets/city-icons/kolkata.png",
    Mumbai: "/assets/city-icons/mumbai.png",
    Delhi: "/assets/city-icons/delhi.png",
    Pune: "/assets/city-icons/pune.png",
};

const AQI_CONFIG = (aqi: number) => {
    if (aqi <= 50) return { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Good" };
    if (aqi <= 100) return { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Moderate" };
    if (aqi <= 150) return { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", label: "Unhealthy SFG" };
    if (aqi <= 200) return { color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "Unhealthy" };
    return { color: "text-purple-600", bg: "bg-purple-600/10", border: "border-purple-600/20", label: "Very Unhealthy" };
};

export default function PopularCityCards() {
    const { data: cities, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ["popular-cities-aqi"],
        queryFn: async () => {
            const res = await http.get("/api/aqi/popular-city-aqi");
            return res.data as CityAQI[];
        },
        refetchInterval: 60000 * 10,
    });

    if (isLoading) return <LoadingGrid />;

    if (isError) return (
        <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="p-4 bg-red-50 rounded-full mb-4">
                <Wind className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Failed to fetch air quality data</h3>
            <p className="text-slate-500 mb-6">Please check your connection and try again.</p>
            <button onClick={() => refetch()} className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium transition-transform hover:scale-105 active:scale-95">
                Retry Load
            </button>
        </div>
    );

    return (
        <section className="relative min-h-screen py-16 px-4 sm:px-8">

            <div className="hidden md:block">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 blur-[120px] rounded-full -z-10" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 blur-[120px] rounded-full -z-10" />
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-blue-600 font-bold uppercase tracking-widest text-xs"
                        >
                            Real-time Analytics
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 mt-2"
                        >
                            India’s <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Metro Hubs</span>
                        </motion.h1>
                    </div>

                    <button
                        onClick={() => refetch()}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm group"
                    >
                        <RefreshCw className={cn("w-4 h-4 group-active:rotate-180 transition-transform duration-500", isFetching && "animate-spin")} />
                        {isFetching ? "Syncing..." : "Update Live Data"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {cities?.map((city, index) => {
                        const config = AQI_CONFIG(city.aqi);
                        return (
                            <motion.div
                                key={city.location}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="h-full"
                            >
                                <Card
                                    className={cn(
                                        "group relative h-full flex flex-col bg-white/70 backdrop-blur-xl border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 rounded-[2.5rem] p-6",
                                        config.border
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "absolute -right-4 -top-4 w-24 h-24 blur-3xl rounded-full transition-opacity opacity-0 group-hover:opacity-100",
                                            config.bg
                                        )}
                                    />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-slate-100 rounded-2xl group-hover:bg-white transition-colors duration-500 shrink-0">
                                                <Image
                                                    src={landmarks[city.location] || "/assets/city-icons/default.png"}
                                                    width={48}
                                                    height={48}
                                                    alt={city.location}
                                                    className="grayscale group-hover:grayscale-0 transition-all duration-500 object-contain"
                                                />
                                            </div>
                                            <div
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shrink-0",
                                                    config.border,
                                                    config.color
                                                )}
                                            >
                                                {config.label}
                                            </div>
                                        </div>

                                        <div className="grow">
                                            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                {city.location}
                                            </h3>

                                            {/* New Flex Container for AQI + Stats */}
                                            <div className="flex items-center justify-between gap-4 mt-2">
                                                {/* Left Side: Large AQI */}
                                                <div className="flex items-baseline gap-1">
                                                    <span
                                                        className={cn(
                                                            "text-6xl font-black tracking-tighter transition-transform group-hover:scale-105 duration-500",
                                                            config.color
                                                        )}
                                                    >
                                                        {city.aqi}
                                                    </span>
                                                    <span className="text-slate-400 font-bold text-xs">AQI</span>
                                                </div>

                                                {/* Right Side: Temperature & Humidity (Stacked) */}
                                                <div className="flex flex-col gap-4 border-l border-slate-100 pl-4">
                                                    <div className="flex items-center gap-2">
                                                        <Thermometer className="w-6 h-6 text-orange-500" />
                                                        <div className="min-w-0">
                                                            <p className="text-[12px] text-slate-400 font-black uppercase leading-none">Temp</p>
                                                            <p className="text-lg font-black text-slate-700 leading-tight">
                                                                {city.temperature?.toFixed(0) ?? "--"}°C
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Droplets className="w-6 h-6 text-blue-500" />
                                                        <div className="min-w-0">
                                                            <p className="text-[12px] text-slate-400 font-black uppercase leading-none">Humid</p>
                                                            <p className="text-lg font-black text-slate-700 leading-tight">
                                                                {city.humidity?.toFixed(0) ?? "--"}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

function LoadingGrid() {
    return (
        <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <Card key={i} className="p-6 rounded-[2.5rem] h-64 space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="w-12 h-12 rounded-2xl" />
                        <Skeleton className="w-20 h-6 rounded-full" />
                    </div>
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-20 h-12" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Skeleton className="h-10 rounded-lg" />
                        <Skeleton className="h-10 rounded-lg" />
                    </div>
                </Card>
            ))}
        </div>
    );
}