"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Activity, Cpu, CheckCircle } from "lucide-react";

interface FeatureItem {
    id: string;
    icon: React.ReactNode;
    badge: string;
    heading: string;
    body: string;
    metrics: string[];
    imageSrc: string;
}

const featureData: FeatureItem[] = [
    {
        id: "cross-platform",
        icon: <Layers className="w-5 h-5" />,
        badge: "Omnichannel Deployment",
        heading: "Complete Responsive Ecosystem Syncing",
        body: "Monitor and track air quality index across all visual breakpoints seamlessly. Your custom environment data scales dynamically across high-definition TV modules, enterprise web hubs, standalone tablets, and mobile applications.",
        metrics: ["Auto-scaling interfaces", "Ultra-low latency syncing", "Cross-device persistent sessions"],
        imageSrc: "/assets/showcase/a2aqi-cross-platform.png"
    },
    {
        id: "realtime-analysis",
        icon: <Activity className="w-5 h-5" />,
        badge: "Live Analytics Engine",
        heading: "Granular Multiparameter Data Mapping",
        body: "Track pollutants like PM2.5, PM10, PM1, TVOC, Temperature, and Humidity in real time. Features smart widgets, color-coded visual parameters, and automated report generators right on your screen.",
        metrics: ["Real-time data stream", "Visual parameter charts", "Custom alarm configurations"],
        imageSrc: "/assets/showcase/a2aqi-cross-platform.png"
    },
    {
        id: "smart-hardware",
        icon: <Cpu className="w-5 h-5" />,
        badge: "Hardware Agnostic Integration",
        heading: "Plug-and-Play Sensor Architecture",
        body: "Engineered to effortlessly map real-time telemetry from outdoor environmental monitors and indoor air sensors right onto the A2AQI unified multi-device ecosystem dashboard with zero complex configurations.",
        metrics: ["Universal API nodes", "Over-The-Air firmwares", "Encrypted transmission logs"],
        imageSrc: "/assets/showcase/a2aqi-cross-platform.png"
    }
];

export default function PlatformShowcaseSection() {
    const [activeId, setActiveId] = useState<string>(featureData[0].id);

    return (
        <section className="bg-[#F8FAFC]">
            <div className="w-full max-w-400 mx-auto px-4 py-20 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500 selection:text-white">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* --- LEFT SIDE: IMAGE --- */}
                    <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center relative">
                        <div className="absolute w-112.5 h-112.5 bg-linear-to-tr from-emerald-400/10 to-teal-400/5 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                        <div className="relative z-10 w-full bg-slate-200 rounded-2xl border border-slate-300 shadow-[0_30px_70px_rgba(0,0,0,0.15)] p-6 sm:p-10">

                            <div className="relative w-full aspect-video flex items-center justify-center ">
                                {featureData.map((item) => {
                                    const isActive = item.id === activeId;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            className="absolute inset-0 w-full h-full flex items-center justify-center"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: isActive ? 1 : 0,
                                                y: isActive ? 0 : 10,
                                                scale: isActive ? [1, 1.03, 1] : 0.96,
                                                zIndex: isActive ? 10 : 0
                                            }}
                                            transition={{
                                                opacity: { duration: 0.4, ease: "easeOut" },
                                                y: { duration: 0.4, ease: "easeOut" },
                                                scale: isActive
                                                    ? { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }
                                                    : { duration: 0.4 }
                                            }}
                                        >
                                            <Image
                                                src={item.imageSrc}
                                                alt={item.heading}
                                                className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(16,185,129,0.12)]"
                                                fill
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-[11px] font-mono tracking-wider text-slate-200 uppercase">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                Active Profile Preview
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE --- */}
                    <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center space-y-4">
                        <div className="space-y-2 mb-4">
                            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block">Unified Dashboard Control</span>
                            <h2 className="text-3xl sm:text-4xl font-bold pb-2 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                                One Hub. Every Screen.
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {featureData.map((item) => {
                                const isActive = activeId === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setActiveId(item.id)}
                                        className={`relative p-5 rounded-xl border transition-all duration-300 cursor-pointer select-none group ${isActive
                                            ? "bg-slate-50 border-slate-200 shadow-sm"
                                            : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                                            }`}
                                    >
                                        <div className="flex gap-4 items-start">
                                            <div className={`p-2 rounded-lg transition-colors shrink-0 ${isActive
                                                ? "bg-emerald-500 text-white"
                                                : "bg-slate-100 text-slate-500 group-hover:text-slate-800"
                                                }`}>
                                                {item.icon}
                                            </div>

                                            <div className="space-y-1 w-full">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-emerald-600" : "text-slate-400"}`}>
                                                        {item.badge}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-slate-900">
                                                    {item.heading}
                                                </h3>

                                                <AnimatePresence initial={false}>
                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                                            className=" pt-2"
                                                        >
                                                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                                                {item.body}
                                                            </p>

                                                            <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-200/60">
                                                                {item.metrics.map((metric) => (
                                                                    <div key={metric} className="flex items-center gap-2 text-base font-medium text-slate-700">
                                                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                                                        {metric}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}