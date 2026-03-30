"use client";

import { useEffect } from "react";
import { MapPin, Activity, Info, TrendingUp, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Graph } from "./graph";
import Image from 'next/image';
import "@/styles/graph-scrollbar.css";

import { AQIMarker } from "../page";
import { cn } from "@/lib/utils";
import {
    getAQIBgColor,
    getAQITextColor,
    getAQITheme,
} from "@/helpers/aqi-color-pallet";
import { useLocationStore } from "@/store/location.store";
import { detectGpsLocation } from "@/store/location.actions";

type AirQualityCardProps = {
    station: AQIMarker | null;
};

export function AirQualityCard({ station }: AirQualityCardProps) {
    const store = useLocationStore();

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

    const data = {
        name: station?.name ?? store.city ?? "Select a location",
        aqi: station?.aqi ?? store.aqi ?? 0,
        pollutants: [
            { label: "PM2.5", value: station?.pm25 ?? store.pm25 ?? 0, unit: "μg/m³", max: 150 },
            { label: "PM10", value: station?.pm10 ?? store.pm10 ?? 0, unit: "μg/m³", max: 200 },
            { label: "CO", value: station?.co ?? store.co ?? 0, unit: "ppm", max: 15 },
            { label: "NO₂", value: station?.no2 ?? store.no2 ?? 0, unit: "ppb", max: 100 },
        ]
    };

    const theme = getAQITheme(data.aqi);
    const moodImage = AirQualityImages[theme.label];

    return (
        <Card className="w-full max-w-105 h-full md:h-fit bg-white text-zinc-900 border-none shadow-[0_-10px_40px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden rounded-t-[2.5rem] md:rounded-[2.5rem]">
            
            <div className="flex flex-col items-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
                <span className="text-[11px] font-bold text-zinc-300 uppercase flex items-center gap-1 tracking-widest">
                    Scroll Down <ChevronDown className="w-3.5 h-3.5 text-zinc-300" />
                </span>
            </div>

            <CardContent className="flex-1 overflow-y-auto custom-scroll px-7 pb-8 space-y-7">
                
                {/* HEADER: Title & Location */}
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-bold text-zinc-800 flex items-center gap-2">
                        <span className="text-cyan-500 font-black italic">AQI</span> 
                        <span className="font-semibold text-zinc-600">Air Quality Map</span>
                    </h1>
                    <div className="flex items-start gap-1.5 text-blue-500/90">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 fill-current/10" />
                        <span className="text-[15px] font-bold leading-tight">{data.name}</span>
                    </div>
                </div>

                {/* HERO: AQI Value & Character */}
                <div className="relative min-h-30 flex items-center">
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-2.5">
                            <Wind className="w-4 h-4 text-cyan-500" />
                            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Air Quality Index</span>
                        </div>
                        
                        <div className="flex items-center gap-5">
                            <span className={cn("text-7xl font-black tracking-tighter leading-none", getAQITextColor(data.aqi))}>
                                {data.aqi}
                            </span>
                            <div className={cn(
                                "px-6 py-2 rounded-xl text-white font-black text-sm uppercase tracking-tight shadow-lg shadow-current/20",
                                getAQIBgColor(data.aqi)
                            )}>
                                {theme.label}
                            </div>
                        </div>
                    </div>

                    {/* CHARACTER POSITIONED TO THE RIGHT */}
                    {moodImage && (
                        <div className="absolute -right-4 bottom-0 scale-110 pointer-events-none">
                            <Image 
                                src={moodImage} 
                                width={80} 
                                height={80} 
                                alt="AQI Character" 
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>
                    )}
                </div>

                {/* POLLUTANTS: Visual Level Bars */}
                <div className="space-y-4 bg-zinc-50/80 p-5 rounded-4xl border border-zinc-100">
                    {data.pollutants.map((p) => (
                        <div key={p.label} className="group">
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
                                    className={cn("h-full rounded-full transition-all duration-700 ease-out", getAQIBgColor(p.value))}
                                    style={{ width: `${Math.min((p.value / p.max) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 5. FOOTER: Graph & Timestamp */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-zinc-400" />
                            <h3 className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest">AQI Trend (Last 7 days)</h3>
                        </div>
                        <Info className="w-4 h-4 text-zinc-300 hover:text-cyan-500 cursor-help transition-colors" />
                    </div>
                    <div className="h-32 w-full bg-zinc-50/50 rounded-2xl p-2 border border-zinc-100/50">
                        <Graph />
                    </div>
                    <p className="text-[10px] text-zinc-300 text-center font-bold uppercase tracking-tighter pt-2">
                        Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Local Time)
                    </p>
                </div>

            </CardContent>
        </Card>
    );
}


function Wind(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
  )
}