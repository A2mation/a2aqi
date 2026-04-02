"use client"

import { useEffect, useState } from "react"
import {
    Share2,
    Droplets,
    Sun,
    Wind,
    Activity,
    AlertCircle,
    ShieldCheck,
    Baby,
    MapIcon
} from "lucide-react"
import Image from 'next/image'
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { AQITheme, getAQITheme } from "@/helpers/aqi-color-pallet"
import { cn } from "@/lib/utils"
import { SparklesCore } from "../ui/sparkles"
import { ShareDialog } from "@/components/Share-Button"
import DynamicPagination from "../Pagination-Dynamic"
import { formatTime } from "@/helpers/time"
import { formatPlaceName } from "@/helpers/format-place-name"
import AirQualityIndexTable from "./air-quality-index-table"
import PopularCityCards from "./popular-city-aqi-table"
import Link from "next/link"

interface AQIAverages {
    aqi: number | null
    pm10: number | null
    pm25: number | null
    temperature: number | null
    humidity: number | null
    city?: string
    state?: string
    country: string
}

export function UniversalAQIDashboard({ data }: { data: { averages: AQIAverages } }) {
    const { averages } = data
    const [open, setOpen] = useState(false)
    const [theme, setTheme] = useState<AQITheme>(getAQITheme(0))

    const AirQualityImages: Record<string, string> = {
        Good: "/assets/aqi-moods/Good.png",
        Moderate: "/assets/aqi-moods/Moderate.png",
        Poor: "/assets/aqi-moods/Poor.png",
        Unhealthy: "/assets/aqi-moods/Unhealthy.png",
        Severe: "/assets/aqi-moods/Severe.png",
        Hazardous: "/assets/aqi-moods/Hazard.png",
    }

    useEffect(() => {
        if (typeof averages.aqi === "number") {
            setTheme(getAQITheme(averages.aqi))
        }
    }, [averages.aqi])

    if (!averages) return null

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            <main className="pt-5 pb-12 px-4 md:px-10 max-w-400 mx-auto space-y-10">


                {/* Cinematic Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "rounded-[3rem] p-8 md:p-10 border border-border/40 relative transition-all duration-1000 shadow-2xl min-h-112.5 flex flex-col justify-between",
                        `bg-linear-to-br from-${theme.bg}`
                    )}
                >
                    <div className="px-2 my-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="overflow-hidden">
                            <DynamicPagination
                                items={[
                                    slugify(averages.country),
                                    averages.state && slugify(averages.state),
                                    averages.city && slugify(averages.city),
                                ].filter((item): item is string => !!item)}
                            />
                        </div>

                        <Link
                            href="/air-quality-map"
                            className="flex h-11 w-full md:w-fit justify-center items-center gap-2.5 px-6 bg-background/90 backdrop-blur-md text-foreground rounded-2xl border border-border/50 shadow-xl text-sm font-black uppercase tracking-tight active:scale-95 transition-all hover:bg-secondary/50"
                        >
                            <MapIcon className="h-5 w-5 text-primary" />
                            <span>View Full Map</span>
                        </Link>
                    </div>
                    {/* Background Sparkles for texture */}
                    {averages.aqi && <SparklesCore
                        className="absolute inset-0 pointer-events-none opacity-30"
                        background="transparent"
                        minSize={0.6}
                        maxSize={1.8}
                        particleDensity={(averages.aqi < 50 ? 1 : 4) * (averages.aqi ? averages.aqi : 1)}
                        particleColor="#000000"
                    />}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={'india-image'}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 0.50, scale: 1 }}
                            className="absolute bottom-0 right-8 max-w-65 md:max-w-3xl pointer-events-none z-0 -translate-y-[2%] "
                        >
                            <Image
                                src={`/assets/india.svg`}
                                alt="India Map Background"
                                width={700}
                                height={600}
                                className="object-contain grayscale contrast-50"
                                priority
                            />
                        </motion.div>
                        <motion.div
                            key={theme.label}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute top-1/2 right-10 md:right-20 -translate-y-1/2 pointer-events-none z-0 hidden lg:block"
                        >
                            <Image
                                src={AirQualityImages[theme.label] || AirQualityImages.Good}
                                alt={theme.label}
                                width={200}
                                height={200}
                                className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] animate-pulse-slow"
                            />
                        </motion.div>
                    </AnimatePresence>

                    <div className="relative z-10 w-full lg:max-w-[65%]">
                        {/* Status Badge & Share */}
                        <div className="flex items-center justify-between mb-8">
                            <div
                                className="px-5 py-2 rounded-full backdrop-blur-md text-white text-[11px] font-black tracking-[0.3em] flex items-center gap-3 border border-white/20 shadow-lg"
                                style={{ backgroundColor: theme.color }}
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                LIVE SENSOR DATA
                            </div>
                        </div>

                        {/* Title Section */}
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.85] text-foreground mb-6">
                            {formatPlaceName(averages.city ?? averages.state ?? averages.country)}'s air is{' '}
                            <span style={{ color: theme.color }} className="block md:inline italic">{theme.label}<span className="text-black">.</span></span>
                        </h1>

                        <p className="text-muted-foreground font-medium text-lg max-w-xl mb-10 border-l-4 pl-4 border-primary/20">
                            The current Air Quality Index is based on real-time PM2.5 and PM10 concentrations monitored in your local area.
                        </p>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Temperature" value={`${Math.round(averages.temperature ?? 0) ?? '--'}°C`} icon={<Sun className="text-orange-500" />} />
                            <StatCard label="Humidity" value={`${Math.round(averages.humidity ?? 0) ?? '--'}%`} icon={<Droplets className="text-blue-500" />} />
                            <StatCard label="PM 2.5" value={Math.round(averages.pm25 ?? 0)} icon={<Wind className="text-emerald-500" />} />
                            <StatCard label="PM 10" value={Math.round(averages.pm10 ?? 0)} icon={<Activity className="text-purple-500" />} />
                        </div>
                    </div>

                    {/* Footer Row of Hero */}
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end mt-2 pt-5 border-t border-white/10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-7xl md:text-9xl font-black tracking-tighter" style={{ color: theme.color }}>
                                {Math.round(averages.aqi ?? 0)}
                            </span>
                            <span className="text-base md:text-2xl font-bold opacity-40 uppercase tracking-widest">AQI Index</span>
                        </div>
                        <div className="text-left md:text-right my-4 md:my-0">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Station Status</p>
                            <p className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-4 py-1 rounded-lg border border-emerald-500/20">
                                Last sync: {formatTime(new Date())}
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Health & Recommendation Grid (The "Filling" Content) */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <RecommendationCard
                        title="Health Risk"
                        desc={getHealthAdvice(averages.aqi ?? 0).risk}
                        icon={<AlertCircle className="h-6 w-6" />}
                        themeColor={theme.color}
                    />
                    <RecommendationCard
                        title="Protective Measures"
                        desc={getHealthAdvice(averages.aqi ?? 0).measures}
                        icon={<ShieldCheck className="h-6 w-6" />}
                        themeColor={theme.color}
                    />
                    <RecommendationCard
                        title="Sensitive Groups"
                        desc={getHealthAdvice(averages.aqi ?? 0).sensitive}
                        icon={<Baby className="h-6 w-6" />}
                        themeColor={theme.color}
                    />
                </section>

                {/* Tables & Footer Content */}
                <section className="pt-5 border-t border-border/40 space-y-10">
                    <AirQualityIndexTable />
                    <PopularCityCards />
                </section>
            </main>
        </div>
    )
}

/* Helper Components for Premium Look */

function StatCard({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
    return (
        <div className="bg-background/30 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-xl hover:bg-background/50 transition-all">
            <div className="mb-3">{icon}</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-1">{label}</p>
            <p className="text-2xl font-black">{value}</p>
        </div>
    )
}

function RecommendationCard({ title, desc, icon, themeColor }: { title: string, desc: string, icon: React.ReactNode, themeColor: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-card border border-border/60 p-8 rounded-[2.5rem] shadow-sm relative"
        >
            <div className="size-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner" style={{ backgroundColor: `${themeColor}20`, color: themeColor }}>
                {icon}
            </div>
            <h3 className="text-xl font-black mb-3 tracking-tight">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">{desc}</p>
        </motion.div>
    )
}

/* Logic for Health Advice based on AQI */
function getHealthAdvice(aqi: number) {
    if (aqi <= 50) return { risk: "Minimal impact. Air is fresh and ideal for all activities.", measures: "Open windows to cross-ventilate your home.", sensitive: "No precautions needed for sensitive individuals." }
    if (aqi <= 100) return { risk: "Moderate concern. Minor breathing discomfort for sensitive people.", measures: "Consider reducing prolonged outdoor heavy exertion.", sensitive: "Sensitive people should monitor symptoms." }
    if (aqi <= 200) return { risk: "High risk of respiratory issues for most residents.", measures: "Wear N95 masks if staying outdoors for long hours.", sensitive: "Children and elderly should avoid outdoor physical activity." }
    return { risk: "Emergency conditions. Serious health effects likely for everyone.", measures: "Stay indoors. Use air purifiers and keep windows closed.", sensitive: "Everyone should avoid all outdoor physical exertion." }
}

function slugify(value: string) {
    return value.toLowerCase().trim().replace(/\s+/g, "-")
}