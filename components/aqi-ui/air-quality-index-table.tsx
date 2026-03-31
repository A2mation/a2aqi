"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ArrowRight, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type TabType = "aqi" | "pm" | "ozone" | "co" | "so2" | "no2";

interface AirQualityLevel {
    level: string;
    range: string;
    color: string;
    glow: string;
    icon: string;
    description: string;
}

const AirQualityIndexTable = () => {
    const [activeTab, setActiveTab] = useState<TabType>("aqi");

    const tabs: TabType[] = ["aqi", "pm", "ozone", "co", "so2", "no2"];
    const tabLabels: Record<TabType, string> = {
        aqi: "AQI",
        pm: "PM 2.5",
        ozone: "Ozone",
        co: "CO",
        so2: "SO2",
        no2: "NO2",
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            {/* Header Section */}
            <header className="mb-12 space-y-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest"
                >
                    <Info className="w-3.5 h-3.5" />
                    Health Standards Guide
                </motion.div>
                <motion.h2
                    key={`title-${activeTab}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight"
                >
                    {TAB_CONTENT[activeTab].title}
                </motion.h2>
                <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
                    {TAB_CONTENT[activeTab].description}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left: Interactive Section */}
                <div className="lg:col-span-8">
                    <div className="p-1.5 bg-slate-100/80 backdrop-blur-md rounded-4xl mb-10 flex flex-wrap gap-1 border border-slate-200/50">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "relative flex-1 min-w-20 py-3 text-sm md:text-base font-bold rounded-full transition-all duration-300",
                                    activeTab === tab
                                        ? "bg-white text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-200"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                                )}
                            >
                                {tabLabels[tab]}
                            </button>
                        ))}
                    </div>

                    {/* List of Levels */}
                    <div className="space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                {QUALITY_LEVELS_BY_TAB[activeTab].map((level, index) => (
                                    <motion.div
                                        key={`${activeTab}-${level.level}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group flex flex-col md:flex-row gap-6 items-center md:items-start bg-white hover:bg-slate-50 border border-slate-100 p-6 rounded-4xl transition-all hover:shadow-xl hover:shadow-slate-200/50"
                                    >
                                        {/* Visual Indicator */}
                                        <div className="relative shrink-0">
                                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner relative z-10", level.color)}>
                                                <Image
                                                    src={level.icon}
                                                    width={40}
                                                    height={40}
                                                    alt={level.level}
                                                    className={cn("drop-shadow-md object-contain", level.level === 'Hazardous' ? 'w-12' : 'w-10')}
                                                />
                                            </div>
                                            <div className={cn("absolute -inset-1 blur-lg opacity-30 rounded-2xl", level.glow)} />
                                        </div>

                                        {/* Text Details */}
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                                <h3 className="font-black text-slate-900 text-2xl tracking-tight">{level.level}</h3>
                                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                                                    {level.range}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 leading-relaxed font-medium">
                                                {level.description}
                                            </p>
                                        </div>

                                        <div className="hidden md:flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="p-2 rounded-full bg-blue-50 text-blue-500">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Premium Showcase Card */}
                <aside className="lg:col-span-4 sticky top-25">
                    <div className="relative group overflow-hidden rounded-[3rem] bg-slate-900 aspect-4/5 shadow-2xl">
                        <Image
                            src="/assets/ads/main-banner.jpg"
                            alt="Indoor Air Quality Monitor"
                            fill
                            className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        <div className="absolute bottom-0 p-8 space-y-4">
                            <div className="flex items-center gap-2 text-blue-400">
                                <ShieldCheck className="w-6 h-6" />
                                <span className="text-xs font-black uppercase tracking-widest">Premium Protection</span>
                            </div>
                            <h4 className="text-3xl font-bold text-white leading-tight">
                                Live your healthiest life with real-time monitoring.
                            </h4>
                            <button className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn shadow-xl">
                                Discover More
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const QUALITY_LEVELS_BY_TAB: Record<TabType, AirQualityLevel[]> = {
    aqi: [
        { level: "Good", range: "0 to 50", color: "bg-emerald-500", glow: "bg-emerald-500", icon: "/assets/aqi-moods/Good.png", description: "The air is fresh and free from toxins. Enjoy outdoor activities without any health concerns." },
        { level: "Moderate", range: "51 to 100", color: "bg-amber-400", glow: "bg-amber-400", icon: "/assets/aqi-moods/Moderate.png", description: "Air quality is acceptable for most, but sensitive individuals might experience mild discomfort." },
        { level: "Poor", range: "101 to 150", color: "bg-orange-500", glow: "bg-orange-500", icon: "/assets/aqi-moods/Poor.png", description: "Breathing may become slightly uncomfortable, especially for those with respiratory issues." },
        { level: "Unhealthy", range: "151 to 200", color: "bg-rose-500", glow: "bg-rose-500", icon: "/assets/aqi-moods/Unhealthy.png", description: "This air quality is particularly risky for children, pregnant women, and the elderly." },
        { level: "Severe", range: "201 to 300", color: "bg-purple-600", glow: "bg-purple-600", icon: "/assets/aqi-moods/Severe.png", description: "Prolonged exposure can cause chronic health issues. Avoid outdoor activities." },
        { level: "Hazardous", range: "301+", color: "bg-slate-900", glow: "bg-slate-600", icon: "/assets/aqi-moods/Hazard.png", description: "Life-threatening pollution levels. Stay indoors and use air purifiers." },
    ],
    pm: [
        { level: "Good", range: "0–12 µg/m³", color: "bg-emerald-500", glow: "bg-emerald-500", icon: "/assets/aqi-moods/Good.png", description: "PM2.5 concentration is low and poses minimal risk." },
        { level: "Moderate", range: "12.1–35.4 µg/m³", color: "bg-amber-400", glow: "bg-amber-400", icon: "/assets/aqi-moods/Moderate.png", description: "Sensitive individuals may experience minor symptoms." },
        { level: "Poor", range: "35.5–55.4 µg/m³", color: "bg-orange-500", glow: "bg-orange-500", icon: "/assets/aqi-moods/Poor.png", description: "Children, elderly, and asthmatics should limit exposure." },
        { level: "Unhealthy", range: "55.5–150.4 µg/m³", color: "bg-rose-500", glow: "bg-rose-500", icon: "/assets/aqi-moods/Unhealthy.png", description: "Everyone may experience respiratory discomfort." },
        { level: "Severe", range: "150.5–250.4 µg/m³", color: "bg-purple-600", glow: "bg-purple-600", icon: "/assets/aqi-moods/Severe.png", description: "Serious health effects with prolonged exposure." },
        { level: "Hazardous", range: "250.5+ µg/m³", color: "bg-slate-900", glow: "bg-slate-600", icon: "/assets/aqi-moods/Hazard.png", description: "Emergency conditions. Avoid all outdoor activity." },
    ],
    ozone: [
        { level: "Good", range: "0–54 ppb", color: "bg-emerald-500", glow: "bg-emerald-500", icon: "/assets/aqi-moods/Good.png", description: "Ozone levels are safe." },
        { level: "Moderate", range: "55–100 ppb", color: "bg-amber-400", glow: "bg-amber-400", icon: "/assets/aqi-moods/Moderate.png", description: "Sensitive people may notice breathing discomfort." },
        { level: "Poor", range: "101-168 ppb", color: "bg-orange-500", glow: "bg-orange-500", icon: "/assets/aqi-moods/Poor.png", description: "Sensitive individuals may experience effects on the lungs and heart." },
        { level: "Unhealthy", range: "169-208 ppb", color: "bg-rose-500", glow: "bg-rose-500", icon: "/assets/aqi-moods/Unhealthy.png", description: "Lung irritation and reduced lung function possible." },
        { level: "Severe", range: "209-748 ppb", color: "bg-purple-600", glow: "bg-purple-600", icon: "/assets/aqi-moods/Severe.png", description: "Increased risk of respiratory damage." },
        { level: "Hazardous", range: "749-1250+ ppb", color: "bg-slate-900", glow: "bg-slate-600", icon: "/assets/aqi-moods/Hazard.png", description: "Severe health effects for all populations." },
    ],
    co: [
        { level: "Good", range: "0–4.4 ppm", color: "bg-emerald-500", glow: "bg-emerald-500", icon: "/assets/aqi-moods/Good.png", description: "No immediate health risk." },
        { level: "Moderate", range: "4.5–9.4 ppm", color: "bg-amber-400", glow: "bg-amber-400", icon: "/assets/aqi-moods/Moderate.png", description: "Sensitive individuals may feel mild effects." },
        { level: "Poor", range: "9.5–12.4 ppb", color: "bg-orange-500", glow: "bg-orange-500", icon: "/assets/aqi-moods/Poor.png", description: "Prolonged exposure may cause mild headaches and fatigue." },
        { level: "Unhealthy", range: "12.5–15.4 ppm", color: "bg-rose-500", glow: "bg-rose-500", icon: "/assets/aqi-moods/Unhealthy.png", description: "Reduced oxygen delivery to organs." },
        { level: "Severe", range: "15.5-20.5 ppm", color: "bg-purple-600", glow: "bg-purple-600", icon: "/assets/aqi-moods/Severe.png", description: "Risk of heart and neurological issues." },
        { level: "Hazardous", range: "20.6+ ppm", color: "bg-slate-900", glow: "bg-slate-600", icon: "/assets/aqi-moods/Hazard.png", description: "Potentially fatal exposure." },
    ],
    so2: [
        { level: "Good", range: "0–35 ppb", color: "bg-emerald-500", glow: "bg-emerald-500", icon: "/assets/aqi-moods/Good.png", description: "No expected health effects." },
        { level: "Moderate", range: "36–75 ppb", color: "bg-amber-400", glow: "bg-amber-400", icon: "/assets/aqi-moods/Moderate.png", description: "Sensitive individuals may experience irritation." },
        { level: "Poor", range: "76–185 ppb", color: "bg-orange-500", glow: "bg-orange-500", icon: "/assets/aqi-moods/Poor.png", description: "Increased likelihood of respiratory symptoms." },
        { level: "Unhealthy", range: "186–304 ppb", color: "bg-rose-500", glow: "bg-rose-500", icon: "/assets/aqi-moods/Unhealthy.png", description: "Breathing difficulty for vulnerable groups." },
        { level: "Severe", range: "305-400 ppb", color: "bg-purple-600", glow: "bg-purple-600", icon: "/assets/aqi-moods/Severe.png", description: "Significant respiratory symptoms." },
        { level: "Hazardous", range: "401+ ppb", color: "bg-slate-900", glow: "bg-slate-600", icon: "/assets/aqi-moods/Hazard.png", description: "Severe respiratory distress." },
    ],
    no2: [
        { level: "Good", range: "0–53 ppb", color: "bg-emerald-500", glow: "bg-emerald-500", icon: "/assets/aqi-moods/Good.png", description: "Normal background levels." },
        { level: "Moderate", range: "54–100 ppb", color: "bg-amber-400", glow: "bg-amber-400", icon: "/assets/aqi-moods/Moderate.png", description: "Minor airway irritation possible." },
        { level: "Poor", range: "101–360 ppb", color: "bg-orange-500", glow: "bg-orange-500", icon: "/assets/aqi-moods/Poor.png", description: "Increased risk of respiratory infections." },
        { level: "Unhealthy", range: "361–649 ppb", color: "bg-rose-500", glow: "bg-rose-500", icon: "/assets/aqi-moods/Unhealthy.png", description: "Increased asthma symptoms." },
        { level: "Severe", range: "650-700 ppb", color: "bg-purple-600", glow: "bg-purple-600", icon: "/assets/aqi-moods/Severe.png", description: "Significant respiratory inflammation." },
        { level: "Hazardous", range: "701+ ppb", color: "bg-slate-900", glow: "bg-slate-600", icon: "/assets/aqi-moods/Hazard.png", description: "Emergency-level exposure." },
    ],
};

const TAB_CONTENT: Record<TabType, { title: string; description: string }> = {
    aqi: { title: "Air Quality Index", description: "The AQI is a measure of overall air quality and its effects on health." },
    pm: { title: "PM 2.5 & PM 10", description: "Particulate Matter - fine particles suspended in the air that affect visibility and respiratory health." },
    ozone: { title: "Ozone", description: "Ground-level ozone is a harmful air pollutant that reduces lung function." },
    co: { title: "Carbon Monoxide", description: "A colorless, odorless gas that reduces oxygen carrying capacity of the blood." },
    so2: { title: "Sulfur Dioxide", description: "A toxic gas that affects the respiratory system and cardiovascular health." },
    no2: { title: "Nitrogen Dioxide", description: "A harmful gas that contributes to smog and poses respiratory health risks." },
};

export default AirQualityIndexTable;