import {
    Activity,
    Wind,
    BarChart3,
    ShieldCheck,
    SlidersHorizontal,
    Layers
} from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureContent {
    id: number;
    tag: string;
    title: string;
    description: string;
    imageName: string;
    badgeText: string;
    bulletPoints: string[];
    icon: React.ReactNode;
}

const UserDashboardPreview: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const features: FeatureContent[] = [
        {
            id: 0,
            tag: "Centralized Telemetry",
            title: "The Main Command Center Overview",
            description: "Get a comprehensive atmospheric status evaluation at a glance. The main control layout brings immediate visibility to structural telemetry, active hardware components, and predictive trends.",
            imageName: "d1.png",
            badgeText: "Real-Time Tracking Console",
            icon: <Wind className="w-5 h-5" />,
            bulletPoints: [
                "Live Air Quality Index (AQI) metric display with immediate health status tags.",
                "Aggregated snapshot trends tracking localized minimum, average, and maximum benchmarks.",
                "Dedicated device subscription counter mapping system hardware longevity parameters.",
                "Granular ambient air pollutant layout profiling individual sub-components down to PM1, PM2.5, PM10, and TVOC etc. levels."
            ]
        },
        {
            id: 1,
            tag: "Advanced Analytical Engine",
            title: "Granular Streams & Predictive Exposure Models",
            description: "Deep dive past superficial values. The dedicated analytics screen partitions macro atmospheric records into interactive matrices, designed to track continuous variations and pinpoint environmental risks.",
            imageName: "d2.png",
            badgeText: "Time-Series Analytics Suite",
            icon: <BarChart3 className="w-5 h-5" />,
            bulletPoints: [
                "Hourly Parameter Stream capturing continuous line-view point data across trailing 60 minutes.",
                "Diurnal Exposure Heatmap breaking historical records into organized daily and hourly color-blocked sets.",
                "Monthly distribution overviews classifying historical data sets cleanly from 'Good' to 'Hazardous'.",
                "Localized peak log indicators monitoring absolute macro/micro threshold exceptions instantly."
            ]
        },
        {
            id: 2,
            tag: "Performance Metrics",
            title: "Long-Term Analytics & Parameter Trends",
            description: "Track your performance and productivity metrics across extended timeframes. This view consolidates long-term historical sensor benchmarks with interactive multi-layered area charts for deep environmental reporting.",
            imageName: "d3.png",
            badgeText: "Historical Analytics Engine",
            icon: <Layers className="w-5 h-5" />,
            bulletPoints: [
                "Macro historical cards tracking 90-day averages for AQI, PM2.5, PM10, and Temperature.",
                "Interactive dropdown filtering to isolate specific atmospheric parameters on demand.",
                "Multi-layered dynamic area chart highlighting Max, Avg, and Min AQI deviations side by side.",
                "Custom interval smoothing allowing quick switching between 7-day windows and macro ranges.",
                "One-click data export functionality generating quick compliance and performance reports."
            ]
        },
        {
            id: 3,
            tag: "Hardware Management",
            title: "Efficient IoT Device Provisioning",
            description: "Manage and organize your physical telemetry hardware efficiently. Track active configurations, serial numbers, and installation environments across your entire sensor grid within a unified workspace interface.",
            imageName: "d4.png",
            badgeText: "Device Management Hub",
            icon: <SlidersHorizontal className="w-5 h-5" />,
            bulletPoints: [
                "Categorized structural view splitting nodes effortlessly between Indoor and Outdoor tracking groups.",
                "Assigned location parameters anchoring sensors precisely to deployment environments (e.g., Odisha Hospital, Kolkata, Garulia).",
                "Serialized unit profiles displaying unique hardware identifiers (SN: A2O4626S) alongside explicit allocation dates.",
                "One-click 'Add Device' provisioning flow to seamlessly scale and register new environmental metrics hardware.",
                "Real-time status markers indicating dynamic sensor assignment configurations and configuration editing access."
            ]
        }
    ];

    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isHovered, features.length]);

    return (
        <>
            <section className="bg-inherit py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
                <div className="max-w-400 mx-auto w-full">

                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-sm font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full">
                            Platform Interface Deep Dive
                        </span>
                        <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl bg-linear-to-r from-teal-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                            Inside the A2AQI Ecosystem
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Explore a professional, ultra-responsive dashboard framework optimized for granular data delivery and atmospheric analysis.
                        </p>
                    </div>

                    {/* Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                        {/* Image Viewer (7 Columns) */}
                        <div
                            className="lg:col-span-7 space-y-4"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div className="relative bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 backdrop-blur-sm">

                                {/* Header Bar */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 px-2">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-rose-400 rounded-full" />
                                        <div className="w-3 h-3 bg-amber-400 rounded-full" />
                                        <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                                    </div>
                                    <div className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-100 px-4 py-1 rounded-full">
                                        {features[currentIndex].badgeText}
                                    </div>
                                    <div className="flex space-x-1 opacity-40">
                                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                </div>

                                {/* Image Container */}
                                <div className="relative w-full rounded-2xl bg-white shadow-inner group min-h-87.5 sm:min-h-112.5 aspect-video">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentIndex}
                                            initial={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
                                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="absolute inset-0 w-full h-full flex items-center justify-center p-2 bg-[#fdfdfd]"
                                        >
                                            <div className="absolute inset-0 bg-slate-900/1 z-10 pointer-events-none group-hover:bg-transparent transition-colors duration-300" />

                                            <div className="relative w-full h-full flex items-center justify-center">
                                                <Image
                                                    src={`/assets/showcase/features/${features[currentIndex].imageName}`}
                                                    alt={features[currentIndex].title}
                                                    fill
                                                    className="object-contain object-center drop-shadow-sm"
                                                    priority
                                                />
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                            </div>

                            {/* Slider Indicators */}
                            <div className="flex justify-center items-center gap-3 pt-2">
                                {features.map((feature, idx) => (
                                    <button
                                        key={feature.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className="group relative py-2 px-1 focus:outline-none"
                                        aria-label={`Go to slide ${idx + 1}`}
                                    >
                                        <div className="h-1.5 rounded-full bg-slate-200 transition-all duration-300 relative overflow-hidden"
                                            style={{ width: idx === currentIndex ? '48px' : '16px' }}>
                                            {idx === currentIndex && (
                                                <motion.div
                                                    initial={{ left: "-100%" }}
                                                    animate={{ left: "0%" }}
                                                    transition={{ duration: isHovered ? 0 : 6, ease: "linear" }}
                                                    className="absolute inset-0 bg-emerald-500 rounded-full"
                                                />
                                            )}
                                            {idx !== currentIndex && (
                                                <div className="absolute inset-0 bg-slate-300 group-hover:bg-slate-400 transition-colors" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDE: Content Card & Descriptions (5 Columns) */}
                        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="space-y-6"
                                >
                                    {/* Badge */}
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-100 inline-flex items-center gap-1.5">
                                            <Activity className="w-3.5 h-3.5" />
                                            {features[currentIndex].tag}
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight leading-tight">
                                            {features[currentIndex].title}
                                        </h3>
                                        <p className="text-slate-600 mt-4 text-base leading-relaxed">
                                            {features[currentIndex].description}
                                        </p>
                                    </div>

                                    <hr className="border-slate-200/80" />

                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                            Key Workspace Attributes
                                        </h4>
                                        <ul className="space-y-3.5">
                                            {features[currentIndex].bulletPoints.map((bullet, index) => (
                                                <motion.li
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    key={index}
                                                    className="flex items-start gap-3 text-base text-slate-600"
                                                >
                                                    <span className="mt-0.5 shrink-0 flex items-center justify-center p-0.5 rounded-full bg-emerald-100 text-emerald-600">
                                                        <ShieldCheck className="w-5 h-5" />
                                                    </span>
                                                    <span className="leading-normal">{bullet}</span>
                                                </motion.li>
                                            ))}

                                            <li className='text-red-600 text-sm opacity-50 text-center pt-3'>
                                                **Parameters Modification option also available**
                                            </li>
                                        </ul>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="pt-6 border-t border-slate-200/60 hidden sm:grid grid-cols-2 gap-3">
                                {features.map((f, i) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`p-3 text-left rounded-xl transition-all border text-xs font-semibold uppercase tracking-wider ${i === currentIndex
                                            ? 'bg-white border-slate-200 shadow-md text-emerald-600 font-bold'
                                            : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                            }`}
                                    >
                                        <div className="truncate">{f.tag}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserDashboardPreview;