"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShieldCheck,
    Tv,
    Map,
    BarChart3,
    ArrowRight
} from 'lucide-react';
import Image from 'next/image';

interface FeaturePoint {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    badge?: string;
    // Replace the values below with your actual showcase image filenames/paths later
    imageSrc: string;
    imageAlt: string;
}

const features: FeaturePoint[] = [
    {
        id: "realtime-analytics",
        icon: <BarChart3 className="w-5 h-5" />,
        title: "Advanced Real-Time Analytics",
        description: "Stream live environmental metrics instantly. Track AQI, PM2.5, PM10, and gas concentrations with sub-second latency and crisp analytics dashboards.",
        badge: "Core Platform",
        imageSrc: "/assets/showcase/user/dashboard.png",
        imageAlt: "A2AQI Realtime Analytics Dashboard View"
    },
    {
        id: "spatial-mapping",
        icon: <Map className="w-5 h-5" />,
        title: "Geospatial Proximity Mapping",
        description: "Visualize network grids through fluid interactive maps that automatically prioritize and surface monitoring stations based on geographical proximity.",
        imageSrc: "/assets/showcase/user/maps.png",
        imageAlt: "A2AQI Geospatial Map and Proximity Grid View"
    },
    {
        id: "reset-compliance",
        icon: <ShieldCheck className="w-5 h-5" />,
        title: "Certified Data Pipeline",
        description: "Engineered to meet global criteria. Seamlessly operate as a certified data provider to fulfill validation standards for your premium building projects.",
        badge: "Advanced",
        imageSrc: "/assets/showcase/user/analysis.png",
        imageAlt: "A2AQI RESET Compliance & Auditing Control Panel"
    },
    {
        id: "display-templates",
        icon: <Tv className="w-5 h-5" />,
        title: "TV Display & Signage Templates",
        description: "Broadcast clean, real-time air health layouts natively to public TV monitors and corporate displays, assuring indoor visitors and teams at a glance.",
        imageSrc: "/assets/showcase/user/tv.png",
        imageAlt: "A2AQI TV Display Signage Template Grid"
    }
];

export function DashboardShowcase() {
    const [activeFeature, setActiveFeature] = useState<FeaturePoint>(features[0]);

    return (
        <section className="relative min-h-screen w-full bg-inherit text-slate-900 py-24 px-4 sm:px-6 lg:px-8">

            {/* Soft Premium Background Light Leaks */}
            <div className="absolute top-0 right-1/4 w-125 h-125 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-12 left-1/4 w-150 h-150 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="">

                {/* Header Block */}
                <div className="mb-20 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-sm text-xs font-semibold tracking-wide text-teal-600 mb-4"
                    >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        A2AQI Premium Dashboard Ecosystem
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6"
                    >
                        An intelligent interface <br />
                        <span className="bg-linear-to-r from-teal-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                            designed for pure clarity.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-slate-500 leading-relaxed"
                    >
                        Empower your environmental management assets. Our state-of-the-art web workspace
                        provides interactive tracking data, multi-device display templates, and automated validation setups.
                    </motion.p>
                </div>

                {/* Interactive Features Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Side Navigation List */}
                    <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
                        {features.map((feature) => {
                            const isSelected = activeFeature.id === feature.id;
                            return (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveFeature(feature)}
                                    className={`w-full group relative p-6 rounded-2xl transition-all duration-300 border text-left outline-none ${isSelected
                                        ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
                                        : 'bg-transparent border-transparent hover:bg-white/50 hover:border-slate-200/40'
                                        }`}
                                >
                                    {/* Active structural indicator badge line */}
                                    {isSelected && (
                                        <motion.div
                                            layoutId="activeIndicatorLine"
                                            className="absolute left-0 top-6 bottom-6 w-1 bg-linear-to-b from-teal-500 to-emerald-500 rounded-r"
                                            transition={{ type: "spring", stiffness: 320, damping: 30 }}
                                        />
                                    )}

                                    <div className="flex gap-4 items-start pl-2">
                                        <div className={`p-2.5 rounded-xl border transition-colors duration-300 ${isSelected
                                            ? 'bg-teal-50 border-teal-100 text-teal-600'
                                            : 'bg-white border-slate-200 text-slate-400 group-hover:text-slate-600'
                                            }`}>
                                            {feature.icon}
                                        </div>

                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <h3 className={`text-lg md:text-3xl font-bold transition-colors duration-300 ${isSelected ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'
                                                    }`}>
                                                    {feature.title}
                                                </h3>
                                                {feature.badge && (
                                                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-teal-50 border border-teal-100 text-teal-600 font-bold">
                                                        {feature.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Side Sticky Screen Display Canvas */}
                    <div className="lg:col-span-7 lg:sticky lg:top-24 order-1 lg:order-2 w-full">
                        <div className="relative w-full aspect-4/3 sm:aspect-16/10 rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-slate-300/60 dden">

                            {/* Outer Laptop/Screen Frame Simulation */}
                            <div className="relative h-full w-full rounded-2xl border border-slate-200 bg-slate-50 shadow-inner flex flex-col">

                                {/* Browser Top Navigation Bar */}
                                <div className="w-full h-10 border-b border-slate-200 bg-white px-4 flex items-center justify-between select-none">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        <span className="text-[11px] text-slate-400 font-mono ml-4">a2aqi.com/dashboard</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-1.5 rounded-full bg-slate-100" />
                                        <div className="w-4 h-4 rounded-full bg-slate-100" />
                                    </div>
                                </div>

                                {/* Main Content Area - Image Frame Container */}
                                <div className="flex-1 w-full h-full relative bg-white">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeFeature.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                                            className="absolute inset-0 w-full h-full p-2"
                                        >
                                            <div className="w-full h-full rounded-xl border border-slate-200/60 shadow-sm relative bg-slate-50 flex items-center justify-center p-1 overflow-hidden">

                                                {/* Actual Image Component */}
                                                <Image
                                                    src={activeFeature.imageSrc}
                                                    alt={activeFeature.imageAlt}
                                                    className="w-full h-full object-contain object-center select-none transition-transform duration-700 hover:scale-[1.02] rounded-lg"
                                                    loading="eager"
                                                    width={1000}
                                                    height={800}
                                                />

                                                {/* Premium Soft Inner Shadow Overlay */}
                                                <div className="absolute inset-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.04)] pointer-events-none rounded-xl" />
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}