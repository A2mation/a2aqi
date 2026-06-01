import {
    Calendar,
    TrendingUp,
    Activity,
    ChevronRight,
    Milestone,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BenefitItem {
    id: string;
    icon: React.ReactNode;
    tag: string;
    title: string;
    description: string;
    imgUrl: string;
}

const MainDashboardShowcase: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('real-time');

    const benefits: BenefitItem[] = [
        {
            id: 'real-time',
            icon: <Activity className="w-5 h-5" />,
            tag: "Dynamic Analytics",
            title: "Granular Hourly Parameter Stream",
            description: "Monitor real-time environmental data with 60 minutes of historical depth. Toggles between view types and parameters are smooth and instantaneous.",
            imgUrl: '/assets/showcase/minute.jpg'
        },
        {
            id: 'weekly',
            icon: <Calendar className="w-5 h-5" />,
            tag: "Clustered Trends",
            title: "Historical Time-Block Heatmaps",
            description: "Identify patterns and historical peaks instantly. Data clusters are arranged by date and time-block for macro-level analysis.",

            imgUrl: '/assets/showcase/weekly.jpg'
        },
        {
            id: 'monthly',
            icon: <TrendingUp className="w-5 h-5" />,
            tag: "Macro Logs",
            title: "Consolidated Monthly Overviews",
            description: "Dive deep into monthly counts, categorizing days from 'Good' to 'Hazardous' with min/max peaks.",
            imgUrl: '/assets/showcase/monthly.jpg'
        },
        {
            id: 'Yearly',
            icon: <Milestone className="w-5 h-5" />,
            tag: "Yearly Trend",
            title: "Macro Distribution Logs & Exceedance Counts",
            description: "Auditing atmospheric health at scale.",
            imgUrl: '/assets/showcase/custom.jpg'
        }
    ];

    const currentBenefit = benefits.find(b => b.id === activeTab) || benefits[0];

    return (
        <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
            <div className="max-w-400 mx-auto w-full">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-semibold tracking-wider text-green-600 uppercase bg-green-100 px-3 py-1 rounded-full">
                        Engineered for atmospheric precision.
                    </span>
                    <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl bg-linear-to-r from-teal-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        Modern. Responsive. Premium.
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Enterprise-grade ambient air quality monitoring compressed into a high-fidelity analytics ecosystem. Track critical particulate matter and gas concentrations with sub-second accuracy.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left Menu (5 Cols) */}
                    <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
                        {benefits.map((item) => {
                            const isSelected = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full group cursor-pointer relative p-6 rounded-2xl transition-all duration-300 border text-left outline-none ${isSelected
                                        ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
                                        : 'bg-transparent border-transparent hover:bg-white/50 hover:border-slate-200/40'
                                        }`}
                                >

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
                                            {item.icon}
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-green-600' : 'text-slate-400'
                                                }`}>
                                                {item.tag}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-1">
                                                {item.title}
                                                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-green-600' : 'opacity-0'
                                                    }`} />
                                            </h3>
                                            <p className="text-base text-slate-500 mt-2 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Component Viewport (7 Cols) */}
                    <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center min-h-125">
                        <motion.div
                            layout
                            className="relative bg-white/40 p-4 rounded-3xl border border-white backdrop-blur-md shadow-2xl shadow-slate-200/80 transition-all duration-500 "
                        >
                            {/* Top Accent Bar decoration */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 px-2">
                                <div className="flex space-x-1.5">
                                    <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                                </div>
                                <div className="text-xs font-mono text-slate-400 bg-slate-100/70 px-3 py-0.5 rounded-md">
                                    Previewing: {currentBenefit.title}
                                </div>
                            </div>

                            {/* Responsive Container for Components */}
                            <div className="relative rounded-2xl border border-slate-200 bg-[#f8f9fa] shadow-sm group min-h-87.5 flex flex-col justify-between p-4">

                                {/* Mimic Top Dashboard Info Bar */}
                                <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-xs border border-slate-100 mb-4 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                                        <span className="font-bold text-sm text-slate-800">{currentBenefit.title}</span>
                                    </div>
                                </div>

                                {/* Animated Component Display Area */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentBenefit.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="flex-1 my-2 flex items-center justify-center border border-dashed border-slate-200 rounded-xl bg-white/50 relative "
                                    >


                                        <div className="w-full max-w-xl mx-auto p-4 md:p-6 z-10">
                                            <Image
                                                src={currentBenefit.imgUrl}
                                                alt={currentBenefit.id}
                                                className="w-full h-full md:h-100 object-contain object-center select-none transition-transform duration-700 hover:scale-[1.02] rounded-lg"
                                                loading="eager"
                                                width={1280}
                                                height={1080}
                                            />
                                        </div>

                                        <div className="absolute inset-0 opacity-5 grid grid-cols-6 grid-rows-4 pointer-events-none">
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <div key={i} className="border-r border-b border-slate-900" />
                                            ))}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Mimic Parameter Badges Footer */}
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 shrink-0">
                                    {['AQI', 'PM2.5', 'PM10', 'PM1.0', 'HUMIDITY', 'TEMP'].map((param, index) => (
                                        <div key={param} className={`p-1.5 rounded-lg border border-slate-100 bg-white text-center text-[10px] md:text-sm font-bold ${index > 3 ? 'hidden sm:block' : ''}`}>
                                            <div className="text-slate-400 font-medium truncate">{param}</div>
                                            <div className="text-slate-800 mt-0.5 font-mono">Avg Value</div>
                                        </div>
                                    ))}
                                </div>

                                <div className='text-red-600 text-sm opacity-50 text-center pt-3'>
                                    **Parameters Modification option also available**
                                </div>

                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default MainDashboardShowcase;
